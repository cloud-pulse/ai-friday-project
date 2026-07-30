"""Embedding generation and vector indexing service for LanceDB vector search."""

import json
from uuid import UUID

import httpx

from config.settings import settings
from database.lancedb.repositories import EmbeddingRepository
from models.inspection import EmbeddingRecord, InspectionResult
from utils.exceptions import ApplicationError
from utils.logging import get_logger

logger = get_logger(__name__)


class EmbeddingService:
    """Handles embedding generation via GenAI Lab MaaS API and LanceDB indexing."""

    def __init__(self, embedding_repository: EmbeddingRepository) -> None:
        self._repo = embedding_repository
        self._base_url = settings.vision_base_url.rstrip("/")
        self._api_path = settings.embedding_api_path
        self._model = settings.embedding_model
        self._api_key = settings.vision_api_key
        self._dimensions = settings.embedding_dimensions

    def generate_embedding(self, text: str) -> list[float]:
        """Calls the GenAI Lab embedding endpoint to compute a vector for input text."""
        if not text or not text.strip():
            raise ApplicationError("Cannot generate embedding for empty text.", code="empty_embedding_input")
        if not self._api_key:
            raise ApplicationError("VISION_API_KEY is not configured.", code="embedding_not_configured", status_code=503)

        payload = {
            "model": self._model,
            "input": text.strip(),
        }
        headers = {
            "Authorization": f"Bearer {self._api_key}",
            "Content-Type": "application/json",
        }

        try:
            with httpx.Client(verify=settings.ai_verify_ssl, timeout=settings.vision_timeout_seconds) as client:
                response = client.post(f"{self._base_url}{self._api_path}", headers=headers, json=payload)
                response.raise_for_status()
                body = response.json()
            vector = body["data"][0]["embedding"]
        except (httpx.HTTPError, KeyError, IndexError, ValueError) as exc:
            logger.error("Embedding generation failed (%s). Using mock embeddings.", exc)
            return [0.0] * self._dimensions

        if len(vector) != self._dimensions:
            logger.warning("Embedding dimension mismatch: expected %d, got %d", self._dimensions, len(vector))

        return vector

    def index_inspection_result(self, result: InspectionResult) -> EmbeddingRecord | None:
        """Formats and stores an inspection result as a vector record in LanceDB."""
        defects_str = ", ".join(f"{d.category} ({d.severity}): {d.description}" for d in result.defects) or "None"
        ocr = result.ocr_result
        ocr_str = f"Medicine: {ocr.medicine_name or 'N/A'}, Batch: {ocr.batch_number or 'N/A'}, Expiry: {ocr.expiry_date or 'N/A'}"
        content = (
            f"Inspection Result [Batch ID: {result.batch_id}, Result ID: {result.id}]: "
            f"Decision: {result.decision.value.upper()}. "
            f"Defects Detected: {defects_str}. "
            f"OCR Details: {ocr_str}. "
            f"Quality Score: {result.quality_score.overall}%. "
            f"AI Summary: {result.ai_summary.finding}"
        )
        try:
            vector = self.generate_embedding(content)
            record = EmbeddingRecord(
                batch_id=result.batch_id,
                source_type="inspection_result",
                source_id=result.id,
                content=content,
                vector=vector,
            )
            return self._repo.create(record)
        except Exception as exc:
            logger.error("Failed to index inspection result %s: %s", result.id, exc)
            return None

    def index_batch_summary(self, batch_id: UUID, summary_text: str) -> EmbeddingRecord | None:
        """Indexes a batch summary into LanceDB."""
        content = f"Batch Summary [Batch ID: {batch_id}]: {summary_text.strip()}"
        try:
            vector = self.generate_embedding(content)
            record = EmbeddingRecord(
                batch_id=batch_id,
                source_type="batch_summary",
                source_id=batch_id,
                content=content,
                vector=vector,
            )
            return self._repo.create(record)
        except Exception as exc:
            logger.error("Failed to index batch summary for batch %s: %s", batch_id, exc)
            return None

    def index_report(self, report_id: UUID, batch_id: UUID, report_text: str) -> EmbeddingRecord | None:
        """Indexes a final/draft inspection report into LanceDB."""
        content = f"Inspection Report [Batch ID: {batch_id}, Report ID: {report_id}]: {report_text.strip()}"
        try:
            vector = self.generate_embedding(content)
            record = EmbeddingRecord(
                batch_id=batch_id,
                source_type="report",
                source_id=report_id,
                content=content,
                vector=vector,
            )
            return self._repo.create(record)
        except Exception as exc:
            logger.error("Failed to index report %s: %s", report_id, exc)
            return None
