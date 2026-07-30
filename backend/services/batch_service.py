from uuid import UUID

from database.lancedb.repositories import BatchRepository, ResultRepository
from models.inspection import InspectionBatch
from schemas.batches import BatchCreate, BatchSummaryResponse


class BatchService:
    """Service to handle batch CRUD and summary calculations."""

    def __init__(
        self, batch_repository: BatchRepository, result_repository: ResultRepository
    ) -> None:
        self._batches = batch_repository
        self._results = result_repository

    def create_batch(self, payload: BatchCreate) -> InspectionBatch:
        batch = InspectionBatch(
            name=payload.name,
            production_line=payload.production_line,
            shift=payload.shift,
            notes=payload.notes,
        )
        return self._batches.create(batch)

    def get_batch(self, batch_id: UUID) -> InspectionBatch | None:
        return self._batches.get(batch_id)

    def list_batches(self) -> list[InspectionBatch]:
        return self._batches.history()

    def get_batch_summary(self, batch_id: UUID) -> BatchSummaryResponse | None:
        batch = self._batches.get(batch_id)
        if not batch:
            return None

        results = self._results.list_by_batch(batch_id, limit=10000)
        passed = sum(1 for r in results if r.decision == "passed")
        failed = sum(1 for r in results if r.decision == "failed")
        needs_review = sum(1 for r in results if r.decision == "needs_review")
        total = len(results)
        avg_score = sum(r.quality_score.overall for r in results) / total if total > 0 else 0.0
        avg_packaging = sum(r.quality_score.packaging_integrity for r in results) / total if total > 0 else 0.0
        avg_label = sum(r.quality_score.label_accuracy for r in results) / total if total > 0 else 0.0
        avg_seal = sum(r.quality_score.seal_quality for r in results) / total if total > 0 else 0.0

        return BatchSummaryResponse(
            id=batch.id,
            name=batch.name,
            status=batch.status.value,
            total_images=total,
            passed=passed,
            failed=failed,
            needs_review=needs_review,
            quality_score=round(avg_score, 2),
            avg_packaging_integrity=round(avg_packaging, 2),
            avg_label_accuracy=round(avg_label, 2),
            avg_seal_quality=round(avg_seal, 2),
        )

    def get_batch_results(self, batch_id: UUID) -> list[dict]:
        results = self._results.list_by_batch(batch_id, limit=10000)
        return [
            {
                "id": str(r.image_id),
                "filename": r.structured_inspection.get("metadata", {}).get("filename", "unknown.jpg"),
                "status": "Passed" if r.decision == "passed" else "Failed",
                "defect": ", ".join(d.category for d in r.defects) or "None",
                "ocrText": r.ocr_result.extracted_text,
                "ocrMatched": r.ocr_result.is_verified,
                "confidence": r.ai_summary.confidence * 100,
                "imagePreview": f"http://localhost:8000/api/v1/inspection/images/{r.image_id}"
            }
            for r in results
        ]
