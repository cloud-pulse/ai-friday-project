from pydantic import BaseModel, Field
from app.domain.models import Decision


class BatchCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    production_line: str = Field(min_length=1, max_length=80)
    shift: str = Field(min_length=1, max_length=40)
    notes: str = Field(default="", max_length=1000)


class ReviewRequest(BaseModel):
    inspector_notes: str = Field(default="", max_length=4000)
    root_cause: str = Field(default="", max_length=2000)
    corrective_actions: str = Field(default="", max_length=2000)
    decision: Decision
    approved_by: str = Field(default="", max_length=120)


class ChatRequest(BaseModel):
    question: str = Field(min_length=2, max_length=1000)
