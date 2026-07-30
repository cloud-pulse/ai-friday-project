"""Report workflow: aggregate stored results, draft, export PDF, and persist metadata."""

from pathlib import Path
from uuid import UUID

from database.lancedb.repositories import BatchRepository, ReportRepository, ResultRepository
from models.inspection import BatchStatus, ReportMetadata, ReportStatus, ReviewDecision
from schemas.reports import ReportGenerationResponse
from services.pdf_report_service import PDFReportService
from services.report_aggregation_service import ReportAggregationService
from services.report_ai_service import ReportAIService
from services.review_service import ReviewService
from utils.exceptions import ApplicationError


class ReportService:
    """Generates a report from concise aggregate data and the inspector's final review."""

    def __init__(
        self,
        batch_repository: BatchRepository,
        result_repository: ResultRepository,
        report_repository: ReportRepository,
        review_service: ReviewService,
        aggregation_service: ReportAggregationService,
        report_ai_service: ReportAIService,
        pdf_service: PDFReportService,
        reports_dir: Path,
    ) -> None:
        self._batches = batch_repository
        self._results = result_repository
        self._reports = report_repository
        self._reviews = review_service
        self._aggregation = aggregation_service
        self._ai = report_ai_service
        self._pdf = pdf_service
        self._reports_dir = reports_dir

    def generate(self, batch_id: UUID) -> ReportGenerationResponse:
        batch = self._batches.get(batch_id)
        if batch is None:
            raise ApplicationError("Inspection batch was not found.", code="batch_not_found", status_code=404)
        review = self._reviews.latest_review(batch_id)
        if review is None:
            raise ApplicationError("An inspector review is required before reporting.", code="review_required", status_code=409)
        results = self._results.list_by_batch(batch_id, limit=10_000)
        if not results:
            raise ApplicationError("At least one inspection result is required before reporting.", code="results_required", status_code=409)

        aggregate = self._aggregation.aggregate(batch, results, review)
        draft = self._ai.generate_draft(aggregate)
        approval = self._approval_status(review.decision)
        report = ReportMetadata(
            batch_id=batch_id,
            status=ReportStatus.APPROVED if approval == "approved" else ReportStatus.FINAL,
            storage_path=f"reports/{batch_id}",
            approved_by=review.inspector_name if approval == "approved" else None,
            approved_at=review.approved_at,
        )
        destination = self._reports_dir / str(batch_id) / f"{report.id}.pdf"
        self._pdf.generate(destination, aggregate, draft, approval)
        report = report.model_copy(update={"storage_path": str(destination.relative_to(self._reports_dir.parent)), "generated_at": report.created_at})
        self._reports.create(report)
        self._batches.update(batch_id, status=BatchStatus.COMPLETED if approval == "approved" else BatchStatus.REPORT_GENERATED)
        return ReportGenerationResponse(report=report, draft=draft, download_url=f"/api/v1/reports/{report.id}/download", final_approval=approval)

    def report_path(self, report_id: UUID) -> Path:
        report = self._reports.get(report_id)
        if report is None or not report.storage_path:
            raise ApplicationError("Report was not found.", code="report_not_found", status_code=404)
        path = (self._reports_dir.parent / report.storage_path).resolve()
        if self._reports_dir.resolve() not in path.parents or not path.is_file():
            raise ApplicationError("Report file was not found.", code="report_file_not_found", status_code=404)
        return path

    @staticmethod
    def _approval_status(decision: ReviewDecision) -> str:
        return "approved" if decision == ReviewDecision.APPROVED else "rejected" if decision == ReviewDecision.REJECTED else "pending"
