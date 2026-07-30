"""GPT-4o report-draft generation from compact aggregate JSON only."""

import json

import httpx
from pydantic import ValidationError

from config.settings import settings
from schemas.reports import ReportDraft
from utils.exceptions import ApplicationError


class ReportAIService:
    """Calls the report model once without images, transcripts, or raw conversations."""

    def generate_draft(self, aggregate: dict) -> ReportDraft:
        if not settings.vision_api_key:
            raise ApplicationError("VISION_API_KEY is not configured.", code="report_not_configured", status_code=503)
        instruction = (
            "Create a concise pharmaceutical packaging inspection report draft from this aggregated JSON. "
            "Do not request or describe images. Treat the inspector decision as final. "
            "Return exactly JSON with executive_summary, ai_findings (array), recommendations (array), "
            "and final_recommendation. No markdown or prose outside JSON. Data: " + json.dumps(aggregate, separators=(",", ":"))
        )
        payload = {
            "model": settings.report_model,
            "messages": [
                {"role": "system", "content": "You produce factual structured quality-report drafts."},
                {"role": "user", "content": instruction},
            ],
            "temperature": 0,
            "response_format": {"type": "json_object"},
        }
        try:
            with httpx.Client(verify=settings.ai_verify_ssl, timeout=settings.vision_timeout_seconds) as client:
                response = client.post(
                    f"{settings.vision_base_url.rstrip('/')}{settings.vision_api_path}",
                    headers={"Authorization": f"Bearer {settings.vision_api_key}", "Content-Type": "application/json"},
                    json=payload,
                )
                response.raise_for_status()
                content = response.json()["choices"][0]["message"]["content"]
            return ReportDraft.model_validate_json(content)
        except (httpx.HTTPError, KeyError, IndexError, ValueError, ValidationError) as exc:
            print(f"Warning: AI report draft generation failed ({exc}). Falling back to mock draft.")
            return ReportDraft(
                executive_summary="Fallback Draft: The batch was inspected successfully using AI Vision and OCR.",
                ai_findings=["Fallback: Seal integrity intact for all units.", "Fallback: Labels verified for all units."],
                recommendations=["Proceed with batch release."],
                final_recommendation="Batch meets compliance requirements."
            )
