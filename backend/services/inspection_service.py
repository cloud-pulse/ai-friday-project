"""End-to-end image inspection orchestration and LanceDB persistence."""

from pathlib import Path
from typing import Any
from uuid import UUID, uuid4


from database.lancedb.repositories import BatchRepository, ImageRepository, ResultRepository
from models.inspection import AISummary, BatchStatus, InspectionImage, InspectionResult
from services.image_preprocessing import ImagePreprocessor
from services.ocr_service import OCRService
from services.quality_score_service import QualityScoreService
from services.vision_service import VisionModelService
from utils.exceptions import ApplicationError


class InspectionService:
    """Coordinates the one-pass inspect-and-store workflow for an uploaded image."""

    def __init__(
        self,
        batch_repository: BatchRepository,
        image_repository: ImageRepository,
        result_repository: ResultRepository,
        preprocessor: ImagePreprocessor,
        ocr_service: OCRService,
        vision_service: VisionModelService,
        quality_score_service: QualityScoreService,
        uploads_dir: Path,
        max_upload_bytes: int,
        embedding_service: Any = None,
    ) -> None:
        self._batches = batch_repository
        self._images = image_repository
        self._results = result_repository
        self._preprocessor = preprocessor
        self._ocr = ocr_service
        self._vision = vision_service
        self._quality = quality_score_service
        self._uploads_dir = uploads_dir
        self._max_upload_bytes = max_upload_bytes
        self._embedding_service = embedding_service

    def inspect_upload(
        self, *, batch_id: UUID, filename: str, content_type: str | None, content: bytes
    ) -> InspectionResult:
        if not content:
            raise ApplicationError("The uploaded image is empty.", code="empty_upload")
        if len(content) > self._max_upload_bytes:
            raise ApplicationError("The uploaded image exceeds the permitted size.", code="upload_too_large", status_code=413)
        if self._batches.get(batch_id) is None:
            raise ApplicationError("Inspection batch was not found.", code="batch_not_found", status_code=404)

        image_id = uuid4()
        path = self._store_upload(batch_id, image_id, filename, content)
        preprocessed = self._preprocessor.preprocess(path)
        ocr_result = self._ocr.extract(preprocessed.image)
        vision = self._vision.inspect(preprocessed.jpeg_bytes, ocr_result)  # exactly one call
        quality_score, decision = self._quality.score(vision, ocr_result)
        image = InspectionImage(
            id=image_id, batch_id=batch_id, storage_path=str(path.relative_to(self._uploads_dir.parent)),
            filename=Path(filename).name or "upload.jpg", media_type=content_type or "image/jpeg", size_bytes=len(content),
        )
        result = InspectionResult(
            batch_id=batch_id, image_id=image.id, decision=decision, defects=vision.defects,
            ocr_result=ocr_result, quality_score=quality_score,
            ai_summary=AISummary(finding=vision.summary, confidence=vision.confidence, requires_human_review=decision.value == "needs_review"),
            structured_inspection={
                "packaging_status": vision.packaging_status, "seal_integrity": vision.seal_integrity,
                "label_verified": vision.label_verified, "ocr": ocr_result.model_dump(mode="json"),
                "defects": [defect.model_dump(mode="json") for defect in vision.defects],
                "confidence": vision.confidence, "summary": vision.summary,
                "metadata": {**vision.metadata, "filename": image.filename, "dimensions": {"width": preprocessed.width, "height": preprocessed.height}},
            },
        )
        self._images.create(image)
        self._results.create(result)
        self._batches.update(batch_id, status=BatchStatus.READY_FOR_REVIEW)
        if self._embedding_service:
            self._embedding_service.index_inspection_result(result)
        return result

    def _store_upload(self, batch_id: UUID, image_id: UUID, filename: str, content: bytes) -> Path:
        suffix = Path(filename).suffix.lower() or ".jpg"
        if suffix not in {".jpg", ".jpeg", ".png", ".webp", ".bmp"}:
            raise ApplicationError("Unsupported image format.", code="unsupported_image_format")
        destination = self._uploads_dir / str(batch_id) / f"{image_id}{suffix}"
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(content)
        return destination
