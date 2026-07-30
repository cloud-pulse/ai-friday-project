"""Shared domain primitives."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class DomainModel(BaseModel):
    """Base model for future persisted domain entities."""

    model_config = ConfigDict(from_attributes=True)


class EntityMetadata(DomainModel):
    """Common identity and audit fields for persisted entities."""

    id: UUID
    created_at: datetime
    updated_at: datetime
