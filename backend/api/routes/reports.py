"""Report generation and PDF download API."""

from uuid import UUID

from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from starlette.concurrency import run_in_threadpool

from api.dependencies import get_report_service
from schemas.reports import ReportGenerationResponse
from services.report_service import ReportService

router = APIRouter()


@router.post("/batches/{batch_id}/reports", response_model=ReportGenerationResponse, summary="Generate AI draft and final PDF report")
async def generate_report(
    batch_id: UUID, report_service: ReportService = Depends(get_report_service)
) -> ReportGenerationResponse:
    """Use stored aggregate data and inspector review to generate a PDF report."""
    return await run_in_threadpool(report_service.generate, batch_id)


@router.get("/reports/{report_id}/download", response_class=FileResponse, summary="Download report PDF")
def download_report(report_id: UUID, report_service: ReportService = Depends(get_report_service)) -> FileResponse:
    """Download the stored professional inspection report PDF."""
    path = report_service.report_path(report_id)
    return FileResponse(path, media_type="application/pdf", filename=path.name)
