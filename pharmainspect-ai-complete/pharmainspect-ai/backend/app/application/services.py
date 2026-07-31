from __future__ import annotations

import re

from app.application.quality import batch_metrics
from app.domain.models import Batch, BatchStatus, Decision
from app.domain.ports import BatchRepository, QualityAssistant, ReportGenerator, VisionInspector


class BatchService:
    def __init__(self, repository: BatchRepository, inspector: VisionInspector) -> None:
        self._repository = repository
        self._inspector = inspector

    def create(self, name: str, production_line: str, shift: str, notes: str) -> Batch:
        return self._repository.save(Batch.create(name, production_line, shift, notes))

    def analyze(self, batch_id: str, files: list[tuple[str, bytes]]) -> Batch:
        batch = self.require(batch_id)
        batch.status = BatchStatus.ANALYZING
        batch.inspections = [self._inspector.inspect(name, content) for name, content in files]
        batch.status = BatchStatus.NEEDS_REVIEW
        return self._repository.save(batch)

    def review(
        self,
        batch_id: str,
        inspector_notes: str,
        root_cause: str,
        corrective_actions: str,
        decision: Decision,
        approved_by: str,
    ) -> Batch:
        from datetime import datetime, timezone

        batch = self.require(batch_id)
        batch.review.inspector_notes = inspector_notes
        batch.review.root_cause = root_cause
        batch.review.corrective_actions = corrective_actions
        batch.review.decision = decision
        batch.review.approved_by = approved_by
        batch.review.reviewed_at = datetime.now(timezone.utc)
        batch.status = {
            Decision.APPROVE: BatchStatus.APPROVED,
            Decision.REJECT: BatchStatus.REJECTED,
            Decision.HOLD: BatchStatus.NEEDS_REVIEW,
            Decision.PENDING: BatchStatus.NEEDS_REVIEW,
        }[decision]
        return self._repository.save(batch)

    def require(self, batch_id: str) -> Batch:
        batch = self._repository.get(batch_id)
        if batch is None:
            raise KeyError(batch_id)
        return batch

    def list(self) -> list[Batch]:
        return self._repository.list()

    def dashboard(self) -> dict[str, object]:
        batches = self.list()
        total_images = sum(len(x.inspections) for x in batches)
        valid_images = sum(
            sum(i.valid_for_inspection for i in x.inspections) for x in batches
        )
        invalid_images = total_images - valid_images
        passed = sum(
            sum(i.passed for i in x.inspections if i.valid_for_inspection)
            for x in batches
        )
        return {
            "total_batches": len(batches),
            "total_images": total_images,
            "invalid_images": invalid_images,
            "overall_quality": round(100 * passed / valid_images) if valid_images else 0,
            "needs_review": sum(x.status == BatchStatus.NEEDS_REVIEW for x in batches),
            "recent_batches": [serialize_batch(x) for x in batches[:5]],
        }


class ReportService:
    def __init__(self, repository: BatchRepository, generator: ReportGenerator) -> None:
        self._repository = repository
        self._generator = generator

    def generate(self, batch_id: str) -> bytes:
        batch = self._repository.get(batch_id)
        if batch is None:
            raise KeyError(batch_id)
        return self._generator.generate_pdf(batch)


class AssistantService:
    OUT_OF_SCOPE_MESSAGE = (
        "I'm sorry, but that question is not within my scope. "
        "I can only help with pharmaceutical packaging inspections, "
        "batch quality, defects, and review results."
    )
    _SCOPE_TERMS = frozenset(
        {
            "batch",
            "batches",
            "defect",
            "defects",
            "expiry",
            "inspect",
            "inspection",
            "inspections",
            "inspector",
            "ocr",
            "packaging",
            "pharma",
            "pharmaceutical",
        }
    )
    _SCOPE_PHRASES = (
        "ai finding",
        "ai confidence",
        "average confidence",
        "broken seal",
        "corrective action",
        "damaged package",
        "failed image",
        "human review",
        "label accuracy",
        "latest failure",
        "passed image",
        "production line",
        "quality score",
        "review result",
        "root cause",
        "seal quality",
        "unreadable label",
        "wrong label",
    )

    def __init__(self, repository: BatchRepository, assistant: QualityAssistant) -> None:
        self._repository = repository
        self._assistant = assistant

    @classmethod
    def is_in_scope(cls, question: str) -> bool:
        """Return whether a question concerns supported inspection data."""
        normalized = " ".join(re.findall(r"[a-z0-9]+", question.casefold()))
        words = set(normalized.split())
        has_image_filename = bool(
            re.search(r"\b[\w-]+\.(?:jpe?g|png|webp)\b", question, re.IGNORECASE)
        )
        return (
            bool(words & cls._SCOPE_TERMS)
            or has_image_filename
            or any(phrase in normalized for phrase in cls._SCOPE_PHRASES)
        )

    def answer(self, question: str) -> str:
        if not self.is_in_scope(question):
            return self.OUT_OF_SCOPE_MESSAGE
        return self._assistant.answer(question, self._repository.list())


def serialize_batch(batch: Batch) -> dict[str, object]:
    return {
        "id": batch.id,
        "name": batch.name,
        "production_line": batch.production_line,
        "shift": batch.shift,
        "notes": batch.notes,
        "created_at": batch.created_at.isoformat(),
        "status": batch.status,
        "metrics": batch_metrics(batch),
        "inspections": [vars_without_slots(x) for x in batch.inspections],
        "review": vars_without_slots(batch.review),
    }


def vars_without_slots(value: object) -> dict[str, object]:
    from dataclasses import asdict
    return asdict(value)
