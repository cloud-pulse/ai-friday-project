"""Report draft and generated-report API contracts."""

from typing import Literal

from pydantic import BaseModel, Field

from models.inspection import ReportMetadata


class ReportDraft(BaseModel):
    executive_summary: str = Field(min_length=1, max_length=5_000)
    ai_findings: list[str] = Field(default_factory=list)
    recommendations: list[str] = Field(default_factory=list)
    final_recommendation: str = Field(min_length=1, max_length=2_000)


class ReportGenerationResponse(BaseModel):
    report: ReportMetadata
    draft: ReportDraft
    download_url: str
    final_approval: Literal["approved", "rejected", "pending"]
