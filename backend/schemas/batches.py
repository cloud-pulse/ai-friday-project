from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field
from models.inspection import BatchStatus

class BatchCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    production_line: str = Field(min_length=1, max_length=100)
    shift: str = Field(min_length=1, max_length=100)
    notes: str | None = Field(default=None, max_length=5_000)

class BatchResponse(BaseModel):
    id: UUID
    name: str
    production_line: str
    shift: str
    notes: str | None = None
    status: BatchStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class BatchSummaryResponse(BaseModel):
    id: UUID
    name: str
    status: str
    total_images: int = 0
    passed: int = 0
    failed: int = 0
    needs_review: int = 0
    quality_score: float = 0.0
    avg_packaging_integrity: float = 0.0
    avg_label_accuracy: float = 0.0
    avg_seal_quality: float = 0.0
