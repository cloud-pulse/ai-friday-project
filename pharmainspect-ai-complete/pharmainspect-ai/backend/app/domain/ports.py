from __future__ import annotations

from typing import Protocol

from app.domain.models import Batch, InspectionResult


class BatchRepository(Protocol):
    def save(self, batch: Batch) -> Batch: ...
    def get(self, batch_id: str) -> Batch | None: ...
    def list(self) -> list[Batch]: ...


class VisionInspector(Protocol):
    def inspect(self, image_name: str, image_bytes: bytes) -> InspectionResult: ...


class ReportGenerator(Protocol):
    def generate_pdf(self, batch: Batch) -> bytes: ...


class QualityAssistant(Protocol):
    def answer(self, question: str, batches: list[Batch]) -> str: ...
