"""One-call vision inspection client for the configured GenAI Lab model."""

import json
from typing import Any, Literal

import httpx
from pydantic import BaseModel, Field, ValidationError

from config.settings import settings
from models.inspection import Defect
from services.vision_prompt import VisionPromptBuilder
from utils.exceptions import ApplicationError


class VisionInspection(BaseModel):
    packaging_status: Literal["passed", "failed", "needs_review"]
    seal_integrity: Literal["intact", "damaged", "uncertain"]
    label_verified: bool
    defects: list[Defect] = Field(default_factory=list)
    confidence: float = Field(ge=0, le=1)
    summary: str
    metadata: dict[str, Any] = Field(default_factory=dict)


class VisionResponseParser:
    @staticmethod
    def parse(content: str) -> VisionInspection:
        cleaned = content.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.split("\n", 1)[1].rsplit("```", 1)[0].strip()
        try:
            return VisionInspection.model_validate(json.loads(cleaned))
        except (json.JSONDecodeError, ValidationError, IndexError) as exc:
            raise ApplicationError(
                "Vision model returned an invalid structured inspection result.",
                code="invalid_vision_response",
                status_code=502,
            ) from exc


class VisionModelService:
    """Executes exactly one chat-completions request for an image inspection."""

    def __init__(self) -> None:
        self._base_url = settings.vision_base_url.rstrip("/")
        self._api_path = settings.vision_api_path
        self._model = settings.vision_model
        self._api_key = settings.vision_api_key

    def inspect(self, image_bytes: bytes, ocr_result) -> VisionInspection:
        if not self._api_key:
            raise ApplicationError("VISION_API_KEY is not configured.", code="vision_not_configured", status_code=503)
        payload = {
            "model": self._model,
            "messages": VisionPromptBuilder.build(image_bytes, ocr_result),
            "temperature": 0,
            "response_format": {"type": "json_object"},
        }
        headers = {"Authorization": f"Bearer {self._api_key}", "Content-Type": "application/json"}
        try:
            with httpx.Client(verify=settings.ai_verify_ssl, timeout=settings.vision_timeout_seconds) as client:
                response = client.post(f"{self._base_url}{self._api_path}", headers=headers, json=payload)
                response.raise_for_status()
                body = response.json()
            content = body["choices"][0]["message"]["content"]
        except (httpx.HTTPError, KeyError, IndexError, ValueError) as exc:
            raise ApplicationError("Vision inspection request failed.", code="vision_request_failed", status_code=502) from exc
        return VisionResponseParser.parse(content)
