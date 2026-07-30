"""EasyOCR extraction and pharmaceutical field parsing."""

import re
from dataclasses import dataclass

import numpy as np

from models.inspection import OCRResult


@dataclass(frozen=True, slots=True)
class OCRDetection:
    text: str
    confidence: float


class OCRService:
    """Runs local EasyOCR once per preprocessed image."""

    def __init__(self, languages: list[str] | None = None) -> None:
        self._languages = languages or ["en"]
        self._reader = None

    @property
    def reader(self):
        if self._reader is None:
            import easyocr

            self._reader = easyocr.Reader(self._languages, gpu=False)
        return self._reader

    def extract(self, image: np.ndarray) -> OCRResult:
        raw_detections = self.reader.readtext(image, detail=1, paragraph=False)
        detections = [OCRDetection(text=text.strip(), confidence=float(confidence)) for _, text, confidence in raw_detections]
        text = "\n".join(item.text for item in detections if item.text)
        confidence = sum(item.confidence for item in detections) / len(detections) if detections else 0.0
        return OCRResult(
            medicine_name=self._medicine_name(detections),
            batch_number=self._match(r"(?:batch|lot)\s*(?:no\.?|number)?\s*[:#-]?\s*([A-Z0-9-]+)", text),
            manufacturing_date=self._date(self._match(r"(?:mfg|manufactured)\s*(?:date)?\s*[:#-]?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})", text)),
            expiry_date=self._date(self._match(r"(?:exp|expiry|expires)\s*(?:date)?\s*[:#-]?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})", text)),
            extracted_text=text,
            is_verified=bool(text and confidence >= 0.60),
            confidence=round(confidence, 4),
        )

    @staticmethod
    def _match(pattern: str, text: str) -> str | None:
        match = re.search(pattern, text, flags=re.IGNORECASE)
        return match.group(1).upper() if match else None

    @staticmethod
    def _date(value: str | None):
        if value is None:
            return None
        from datetime import datetime

        for format_string in ("%d/%m/%Y", "%d-%m-%Y", "%d/%m/%y", "%d-%m-%y"):
            try:
                return datetime.strptime(value, format_string).date()
            except ValueError:
                continue
        return None

    @staticmethod
    def _medicine_name(detections: list[OCRDetection]) -> str | None:
        candidates = [item.text for item in detections if len(item.text) >= 3 and not re.search(r"\d{2,}", item.text)]
        return candidates[0] if candidates else None
