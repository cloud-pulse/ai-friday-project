"""Public API response contracts."""

from typing import Any

from pydantic import BaseModel, Field

from models.inspection import InspectionResult


class HealthResponse(BaseModel):
    """Response for the API health probe."""

    status: str = Field(examples=["healthy"])
    environment: str = Field(examples=["development"])


class VersionResponse(BaseModel):
    """Response describing the deployed API."""

    name: str
    version: str
    api_prefix: str


class ErrorDetail(BaseModel):
    """Machine-readable error context."""

    code: str = Field(examples=["validation_error"])
    message: str = Field(examples=["The request payload is invalid."])
    details: Any | None = None


class ErrorResponse(BaseModel):
    """Consistent error envelope for all API failures."""

    error: ErrorDetail


class InspectionProcessResponse(BaseModel):
    """Structured one-image inspection response ready for the review UI."""

    result: InspectionResult
