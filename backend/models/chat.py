"""Typed domain models for RAG chat session persistence and history management."""

from datetime import datetime, timezone
from enum import StrEnum
from uuid import UUID, uuid4

from pydantic import Field

from models.common import DomainModel


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class ChatRole(StrEnum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class ChatSession(DomainModel):
    """Tracks a chat conversation thread and its running summary."""

    id: UUID = Field(default_factory=uuid4)
    batch_id: UUID | None = None
    title: str = Field(default="Quality Assistant Session", max_length=200)
    summary: str = Field(default="", max_length=10_000)
    created_at: datetime = Field(default_factory=utc_now)
    updated_at: datetime = Field(default_factory=utc_now)


class ChatMessage(DomainModel):
    """Single turn message within a chat session."""

    id: UUID = Field(default_factory=uuid4)
    session_id: UUID
    role: ChatRole
    content: str = Field(min_length=1, max_length=50_000)
    created_at: datetime = Field(default_factory=utc_now)
