"""Strict structured-output prompt for the single vision-model request."""

import base64
import json

from models.inspection import OCRResult


class VisionPromptBuilder:
    """Builds an OpenAI-compatible chat-completions request with no narrative output."""

    @staticmethod
    def build(image_bytes: bytes, ocr_result: OCRResult) -> list[dict]:
        image_data_url = "data:image/jpeg;base64," + base64.b64encode(image_bytes).decode("ascii")
        contract = {
            "packaging_status": "passed | failed | needs_review",
            "seal_integrity": "intact | damaged | uncertain",
            "label_verified": "boolean",
            "defects": [{"category": "string", "description": "string", "severity": "low|medium|high|critical", "confidence": "0..1"}],
            "confidence": "0..1",
            "summary": "short factual finding",
            "metadata": {"visible_observations": ["string"]},
        }
        instruction = (
            "Inspect this pharmaceutical package image. Return exactly one JSON object and no markdown or prose. "
            "Do not infer text that is not visible. Use the provided OCR only as supporting evidence. "
            f"Required JSON schema: {json.dumps(contract)}. OCR evidence: {ocr_result.model_dump_json()}."
        )
        return [
            {"role": "system", "content": "You are a pharmaceutical packaging inspector. Output valid JSON only."},
            {"role": "user", "content": [{"type": "text", "text": instruction}, {"type": "image_url", "image_url": {"url": image_data_url}}]},
        ]
