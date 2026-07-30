"""Deterministic local quality scoring; no model calls."""

from models.inspection import InspectionDecision, OCRResult, QualityScore
from services.vision_service import VisionInspection


class QualityScoreService:
    _PENALTIES = {"low": 5, "medium": 12, "high": 25, "critical": 50}

    def score(self, vision: VisionInspection, ocr: OCRResult) -> tuple[QualityScore, InspectionDecision]:
        packaging = max(0.0, 100.0 - sum(self._PENALTIES[defect.severity] for defect in vision.defects))
        label = 100.0 if vision.label_verified and ocr.is_verified else 50.0 if ocr.extracted_text else 0.0
        seal = {"intact": 100.0, "uncertain": 60.0, "damaged": 0.0}.get(vision.seal_integrity.lower(), 50.0)
        score = QualityScore(
            overall=round(packaging * 0.45 + label * 0.30 + seal * 0.25, 2),
            packaging_integrity=round(packaging, 2),
            label_accuracy=round(label, 2),
            seal_quality=round(seal, 2),
        )
        status = vision.packaging_status.lower()
        if status == "failed" or score.overall < 70:
            return score, InspectionDecision.FAILED
        if status == "needs_review" or score.overall < 90 or vision.confidence < 0.80:
            return score, InspectionDecision.NEEDS_REVIEW
        return score, InspectionDecision.PASSED
