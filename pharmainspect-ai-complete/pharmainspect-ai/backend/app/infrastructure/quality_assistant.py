from __future__ import annotations

import re

from app.application.quality import batch_metrics
from app.domain.models import Batch, InspectionResult


class RuleBasedQualityAssistant:
    """Answer supported questions using the stored inspection metrics."""

    def answer(self, question: str, batches: list[Batch]) -> str:
        if not batches:
            return "No inspection batches are available yet. Create and analyze a batch first."

        image_match = self._requested_image(question, batches)
        if image_match is not None:
            batch, inspection = image_match
            return self._image_answer(batch, inspection)

        requested_image = self._requested_image_name(question)
        if requested_image is not None:
            return (
                f"I couldn't find an inspection record for {requested_image}. "
                "Please check the image filename and try again."
            )

        batch = self._requested_batch(question, batches)
        if batch is None:
            requested_name = self._requested_batch_name(question)
            return (
                f"I couldn't find batch {requested_name}. "
                "Please check the batch name and try again."
            )

        metrics = batch_metrics(batch)
        normalized_question = question.casefold()

        if "confidence" in normalized_question:
            if not batch.inspections:
                return f"Batch {batch.name} has no inspection results, so an average AI confidence is not available."
            confidence = float(metrics["average_confidence"])
            return (
                f"The average AI confidence for batch {batch.name} is "
                f"{confidence:.2f} ({confidence:.0%})."
            )

        defects = metrics["defect_counts"]
        common = max(defects, key=defects.get) if defects else "none"
        return (
            f"Based on batch {batch.name}, the quality score is {metrics['quality_score']}%. "
            f"It contains {metrics['failed']} failed image(s), and the most common recorded defect is {common}. "
            "This is an AI-assisted interpretation; the inspector's review and final decision remain authoritative."
        )

    @staticmethod
    def _image_answer(batch: Batch, inspection: InspectionResult) -> str:
        confidence = f"{inspection.confidence:.0%}"
        if not inspection.valid_for_inspection:
            reason = ", ".join(inspection.defects)
            return (
                f"{inspection.image_name} was rejected as an invalid inspection image "
                f"in batch {batch.name}. Reason: {reason}. "
                "It was excluded from the batch quality score and no packaging defect "
                "assessment was performed."
            )
        if inspection.passed:
            return (
                f"{inspection.image_name} passed inspection in batch {batch.name} "
                f"with {confidence} AI confidence. No failure reason was recorded. "
                "The inspector's final decision remains authoritative."
            )

        defects = ", ".join(inspection.defects) or "an unspecified visual anomaly"
        return (
            f"{inspection.image_name} failed inspection in batch {batch.name}. "
            f"Failure reason: {defects}. "
            f"AI confidence / nearest-reference similarity: {confidence}. "
            f"Recorded scores — packaging integrity: {inspection.packaging_integrity}%, "
            f"seal quality: {inspection.seal_quality}%, and label accuracy: {inspection.label_accuracy}%. "
            "Human validation is required before final disposition."
        )

    @classmethod
    def _requested_image(
        cls,
        question: str,
        batches: list[Batch],
    ) -> tuple[Batch, InspectionResult] | None:
        normalized_question = question.casefold()
        for batch in batches:
            for inspection in batch.inspections:
                if inspection.image_name.casefold() in normalized_question:
                    return batch, inspection
        return None

    @staticmethod
    def _requested_image_name(question: str) -> str | None:
        match = re.search(
            r"\b[\w-]+\.(?:jpe?g|png|webp)\b",
            question,
            re.IGNORECASE,
        )
        return match.group(0) if match else None

    @classmethod
    def _requested_batch(cls, question: str, batches: list[Batch]) -> Batch | None:
        normalized_question = cls._normalize(question)
        question_words = set(normalized_question.split())

        for batch in batches:
            normalized_name = cls._normalize(batch.name)
            identifying_words = {
                word
                for word in normalized_name.split()
                if word not in {"batch", "lot"} and len(word) >= 2
            }
            if (
                f" {normalized_name} " in f" {normalized_question} "
                or batch.id.casefold() in question.casefold()
                or identifying_words & question_words
            ):
                return batch

        if cls._requested_batch_name(question) is not None:
            return None
        return batches[0]

    @staticmethod
    def _requested_batch_name(question: str) -> str | None:
        match = re.search(
            r"\bbatch\s+([a-z]*\d+[a-z0-9_-]*)",
            question,
            re.IGNORECASE,
        )
        return match.group(1) if match else None

    @staticmethod
    def _normalize(value: str) -> str:
        return " ".join(re.findall(r"[a-z0-9]+", value.casefold()))
