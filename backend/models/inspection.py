"""Typed domain models for inspection persistence and RAG retrieval."""

from datetime import date, datetime, timezone
from enum import StrEnum
from math import isfinite
from typing import Any, Literal
from uuid import UUID, uuid4

from pydantic import Field, field_validator

from models.common import DomainModel


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class BatchStatus(StrEnum):
    DRAFT = "draft"
    PROCESSING = "processing"
    READY_FOR_REVIEW = "ready_for_review"
    REVIEWED = "reviewed"
    REPORT_GENERATED = "report_generated"
    COMPLETED = "completed"
    FAILED = "failed"


class InspectionDecision(StrEnum):
    PASSED = "passed"
    FAILED = "failed"
    NEEDS_REVIEW = "needs_review"


class ReviewDecision(StrEnum):
    APPROVED = "approved"
    REJECTED = "rejected"
    ON_HOLD = "on_hold"


class ReportStatus(StrEnum):
    DRAFT = "draft"
    FINAL = "final"
    APPROVED = "approved"


class Defect(DomainModel):
    category: str
    description: str
    severity: Literal["low", "medium", "high", "critical"]
    confidence: float = Field(ge=0, le=1)


class OCRResult(DomainModel):
    medicine_name: str | None = None
    batch_number: str | None = None
    manufacturing_date: date | None = None
    expiry_date: date | None = None
    extracted_text: str = ""
    is_verified: bool = False
    confidence: float = Field(ge=0, le=1)


class QualityScore(DomainModel):
    overall: float = Field(ge=0, le=100)
    packaging_integrity: float = Field(ge=0, le=100)
    label_accuracy: float = Field(ge=0, le=100)
    seal_quality: float = Field(ge=0, le=100)


class AISummary(DomainModel):
    finding: str
    recommendation: str | None = None
    confidence: float = Field(ge=0, le=1)
    requires_human_review: bool = True


class InspectionBatch(DomainModel):
    id: UUID = Field(default_factory=uuid4)
    name: str = Field(min_length=1, max_length=200)
    production_line: str = Field(min_length=1, max_length=100)
    shift: str = Field(min_length=1, max_length=100)
    notes: str | None = Field(default=None, max_length=5_000)
    status: BatchStatus = BatchStatus.DRAFT
    created_at: datetime = Field(default_factory=utc_now)
    updated_at: datetime = Field(default_factory=utc_now)


class InspectionImage(DomainModel):
    id: UUID = Field(default_factory=uuid4)
    batch_id: UUID
    storage_path: str = Field(min_length=1, max_length=1_000)
    filename: str = Field(min_length=1, max_length=255)
    media_type: str = Field(default="image/jpeg", max_length=100)
    size_bytes: int = Field(ge=0)
    created_at: datetime = Field(default_factory=utc_now)


class InspectionResult(DomainModel):
    """Canonical reusable record produced by one image inspection."""

    id: UUID = Field(default_factory=uuid4)
    batch_id: UUID
    image_id: UUID
    decision: InspectionDecision
    defects: list[Defect] = Field(default_factory=list)
    ocr_result: OCRResult
    quality_score: QualityScore
    ai_summary: AISummary
    structured_inspection: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=utc_now)
    updated_at: datetime = Field(default_factory=utc_now)


class InspectorReview(DomainModel):
    id: UUID = Field(default_factory=uuid4)
    batch_id: UUID
    inspector_name: str = Field(min_length=1, max_length=200)
    notes: str | None = Field(default=None, max_length=10_000)
    root_cause: str | None = Field(default=None, max_length=5_000)
    corrective_actions: list[str] = Field(default_factory=list)
    decision: ReviewDecision
    approved_at: datetime | None = None
    created_at: datetime = Field(default_factory=utc_now)
    updated_at: datetime = Field(default_factory=utc_now)


class ReportMetadata(DomainModel):
    id: UUID = Field(default_factory=uuid4)
    batch_id: UUID
    status: ReportStatus = ReportStatus.DRAFT
    storage_path: str | None = Field(default=None, max_length=1_000)
    generated_at: datetime | None = None
    approved_by: str | None = Field(default=None, max_length=200)
    approved_at: datetime | None = None
    created_at: datetime = Field(default_factory=utc_now)
    updated_at: datetime = Field(default_factory=utc_now)


EmbeddingSource = Literal["inspection_result", "batch_summary", "report"]


class EmbeddingRecord(DomainModel):
    """RAG document embedding. Raw AI chat messages are deliberately excluded."""

    id: UUID = Field(default_factory=uuid4)
    batch_id: UUID
    source_type: EmbeddingSource
    source_id: UUID
    content: str = Field(min_length=1, max_length=50_000)
    vector: list[float] = Field(min_length=1)
    created_at: datetime = Field(default_factory=utc_now)

    @field_validator("vector")
    @classmethod
    def finite_vector(cls, value: list[float]) -> list[float]:
        if any(not isfinite(component) for component in value):
            raise ValueError("Embedding vector must contain only finite values.")
        return value


class EmbeddingSearchHit(DomainModel):
    id: UUID
    batch_id: UUID
    source_type: EmbeddingSource
    source_id: UUID
    content: str
    distance: float
