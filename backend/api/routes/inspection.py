"""Image inspection API endpoint."""

from uuid import UUID

from fastapi import APIRouter, Depends, File, UploadFile, status
from starlette.concurrency import run_in_threadpool

from api.dependencies import get_inspection_service
from schemas.responses import InspectionProcessResponse
from services.inspection_service import InspectionService
from utils.exceptions import ApplicationError

router = APIRouter(prefix="/inspection")


@router.post(
    "/batches/{batch_id}/images",
    response_model=InspectionProcessResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload and inspect one package image",
)
async def inspect_image(
    batch_id: UUID,
    image: UploadFile = File(description="Pharmaceutical package image"),
    inspection_service: InspectionService = Depends(get_inspection_service),
) -> InspectionProcessResponse:
    """Run OpenCV, EasyOCR, one vision request, local scoring, and persistence."""
    if image.content_type and not image.content_type.startswith("image/"):
        raise ApplicationError("Upload must be an image file.", code="invalid_content_type")
    content = await image.read()
    result = await run_in_threadpool(
        inspection_service.inspect_upload,
        batch_id=batch_id,
        filename=image.filename or "upload.jpg",
        content_type=image.content_type,
        content=content,
    )
    return InspectionProcessResponse(result=result)

from fastapi.responses import FileResponse
from database.lancedb.repositories import ImageRepository
from api.dependencies import get_lancedb_client

@router.get(
    "/images/{image_id}",
    summary="Get an uploaded image by ID",
)
async def get_image(
    image_id: UUID,
    client = Depends(get_lancedb_client),
):
    repo = ImageRepository(client)
    image = repo.get(image_id)
    if not image:
        raise ApplicationError("Image not found", code="image_not_found", status_code=404)
        
    from config.settings import settings
    file_path = settings.base_dir / image.storage_path
    if not file_path.exists():
        raise ApplicationError("Image file not found on disk", code="file_not_found", status_code=404)
        
    return FileResponse(file_path, media_type=image.media_type)
