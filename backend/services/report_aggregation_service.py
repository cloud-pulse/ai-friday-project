"""Compact, deterministic batch aggregation for report generation."""

from collections import Counter
from typing import Any

from models.inspection import InspectionBatch, InspectionDecision, InspectionResult, InspectorReview


class ReportAggregationService:
    """Creates the minimal JSON context required for an AI report draft."""

    def aggregate(
        self, batch: InspectionBatch, results: list[InspectionResult], review: InspectorReview
    ) -> dict[str, Any]:
        total = len(results)
        decisions = Counter(result.decision.value for result in results)
        defects = Counter(defect.category for result in results for defect in result.defects)
        def average(metric: str) -> float:
            return round(sum(getattr(result.quality_score, metric) for result in results) / total, 2) if total else 0.0

        return {
            "batch": {
                "id": str(batch.id), "name": batch.name, "production_line": batch.production_line,
                "shift": batch.shift, "notes": batch.notes,
            },
            "inspection_summary": {
                "images_processed": total,
                "passed": decisions[InspectionDecision.PASSED.value],
                "failed": decisions[InspectionDecision.FAILED.value],
                "needs_review": decisions[InspectionDecision.NEEDS_REVIEW.value],
                "defect_counts": dict(defects),
            },
            "quality_metrics": {
                "overall": average("overall"), "packaging_integrity": average("packaging_integrity"),
                "label_accuracy": average("label_accuracy"), "seal_quality": average("seal_quality"),
            },
            "ai_findings": [result.ai_summary.model_dump(mode="json") for result in results],
            "inspector_review": review.model_dump(mode="json"),
        }
