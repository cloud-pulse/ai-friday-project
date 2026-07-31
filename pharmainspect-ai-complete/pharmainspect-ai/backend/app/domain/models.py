from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import StrEnum
from uuid import uuid4


class BatchStatus(StrEnum):
    DRAFT = "draft"
    ANALYZING = "analyzing"
    NEEDS_REVIEW = "needs_review"
    APPROVED = "approved"
    REJECTED = "rejected"


class Decision(StrEnum):
    PENDING = "pending"
    APPROVE = "approve"
    REJECT = "reject"
    HOLD = "hold"


@dataclass(slots=True)
class InspectionResult:
    id: str
    image_name: str
    packaging_integrity: int
    seal_quality: int
    label_accuracy: int
    ocr_verified: bool
    defects: list[str]
    confidence: float
    ai_summary: str
    passed: bool
    valid_for_inspection: bool = True


@dataclass(slots=True)
class HumanReview:
    inspector_notes: str = ""
    root_cause: str = ""
    corrective_actions: str = ""
    decision: Decision = Decision.PENDING
    approved_by: str = ""
    reviewed_at: datetime | None = None


@dataclass(slots=True)
class Batch:
    id: str
    name: str
    production_line: str
    shift: str
    notes: str
    created_at: datetime
    status: BatchStatus = BatchStatus.DRAFT
    inspections: list[InspectionResult] = field(default_factory=list)
    review: HumanReview = field(default_factory=HumanReview)

    @staticmethod
    def create(name: str, production_line: str, shift: str, notes: str = "") -> "Batch":
        return Batch(
            id=str(uuid4()),
            name=name,
            production_line=production_line,
            shift=shift,
            notes=notes,
            created_at=datetime.now(timezone.utc),
        )
