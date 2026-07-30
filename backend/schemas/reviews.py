"""Request and response contracts for human inspection review."""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

from models.inspection import InspectorReview, ReviewDecision


class InspectorReviewCreate(BaseModel):
    inspector_name: str = Field(min_length=1, max_length=200)
    notes: str | None = Field(default=None, max_length=10_000)
    root_cause: str | None = Field(default=None, max_length=5_000)
    corrective_actions: list[str] = Field(default_factory=list, max_length=100)
    decision: ReviewDecision


class InspectorReviewResponse(BaseModel):
    review: InspectorReview
    approval_status: Literal["approved", "rejected", "pending"]
    final_decision: ReviewDecision
    approved_at: datetime | None
