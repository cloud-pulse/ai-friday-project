from __future__ import annotations

import json
from typing import Any

import httpx

from app.application.quality import batch_metrics
from app.domain.models import Batch
from app.domain.ports import QualityAssistant


class TCSGenAIQualityAssistant:
    """Grounded quality assistant backed by the TCS GenAI Lab chat API."""

    SYSTEM_PROMPT = """You are the PharmaInspect AI Quality Assistant.
Answer only questions about the supplied pharmaceutical packaging inspection records.
Use only facts present in the supplied context. Never invent a batch, image, defect,
score, reviewer, root cause, corrective action, or decision.

For a question about one image, discuss only that image. Explain its exact recorded
failure reasons and scores without listing retrieved reference filenames.
Clearly distinguish invalid uploads from valid failed inspections. Invalid images were
excluded from quality calculations and did not receive a packaging defect assessment.
State that AI findings require human validation and that the inspector's final
disposition is authoritative. Keep answers concise and operationally useful."""

    def __init__(
        self,
        *,
        api_key: str,
        fallback: QualityAssistant,
        base_url: str = "https://genailab.tcs.in",
        model: str = "azure_ai/genailab-maas-DeepSeek-V3-0324",
        verify_ssl: bool = False,
        timeout_seconds: float = 45.0,
        client: httpx.Client | None = None,
    ) -> None:
        if not api_key.strip():
            raise ValueError("TCS GenAI API key is required")
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.model = model
        self.fallback = fallback
        self.client = client or httpx.Client(
            verify=verify_ssl,
            timeout=timeout_seconds,
        )

    def answer(self, question: str, batches: list[Batch]) -> str:
        payload = {
            "model": self.model,
            "temperature": 0.1,
            "max_tokens": 500,
            "messages": [
                {"role": "system", "content": self.SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": (
                        "Inspection context:\n"
                        f"{json.dumps(self._context(batches), ensure_ascii=False)}\n\n"
                        f"Question: {question}"
                    ),
                },
            ],
        }
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        try:
            response = self._post_chat(payload, headers)
            response.raise_for_status()
            content = response.json()["choices"][0]["message"]["content"]
            if not isinstance(content, str) or not content.strip():
                raise ValueError("TCS GenAI returned an empty response")
            return content.strip()
        except (httpx.HTTPError, KeyError, TypeError, ValueError, json.JSONDecodeError):
            return (
                "The TCS GenAI service is temporarily unavailable, so I used the "
                "local inspection assistant. "
                + self.fallback.answer(question, batches)
            )

    def _post_chat(
        self,
        payload: dict[str, Any],
        headers: dict[str, str],
    ) -> httpx.Response:
        response = self.client.post(
            f"{self.base_url}/chat/completions",
            headers=headers,
            json=payload,
        )
        if response.status_code == 404 and not self.base_url.endswith("/v1"):
            response = self.client.post(
                f"{self.base_url}/v1/chat/completions",
                headers=headers,
                json=payload,
            )
        return response

    @staticmethod
    def _context(batches: list[Batch]) -> dict[str, object]:
        batch_context: list[dict[str, object]] = []
        for batch in batches[:10]:
            inspections = [
                {
                    "image_name": item.image_name,
                    "valid_for_inspection": item.valid_for_inspection,
                    "passed": item.passed,
                    "confidence": item.confidence,
                    "packaging_integrity": item.packaging_integrity,
                    "seal_quality": item.seal_quality,
                    "label_accuracy": item.label_accuracy,
                    "reasons": item.defects,
                }
                for item in batch.inspections[:30]
            ]
            batch_context.append(
                {
                    "id": batch.id,
                    "name": batch.name,
                    "production_line": batch.production_line,
                    "shift": batch.shift,
                    "status": batch.status,
                    "metrics": batch_metrics(batch),
                    "inspections": inspections,
                    "human_review": {
                        "inspector_notes": batch.review.inspector_notes,
                        "root_cause": batch.review.root_cause,
                        "corrective_actions": batch.review.corrective_actions,
                        "decision": batch.review.decision,
                        "approved_by": batch.review.approved_by,
                    },
                }
            )
        return {
            "source": "PharmaInspect structured inspection records",
            "batch_count_in_context": len(batch_context),
            "batches": batch_context,
        }
