from __future__ import annotations

import json

import httpx

from app.domain.models import Batch, InspectionResult
from app.infrastructure.quality_assistant import RuleBasedQualityAssistant
from app.infrastructure.tcs_ai import TCSGenAIQualityAssistant


def inspected_batch() -> Batch:
    batch = Batch.create("A108", "Line 1", "Morning")
    batch.inspections = [
        InspectionResult(
            "inspection-1",
            "package.png",
            83,
            96,
            82,
            False,
            ["Overall match 83% is below the 90% threshold"],
            0.83,
            "Evidence",
            False,
        )
    ]
    return batch


def test_tcs_assistant_calls_documented_model_with_grounded_context() -> None:
    captured: dict[str, object] = {}

    def handler(request: httpx.Request) -> httpx.Response:
        captured["url"] = str(request.url)
        captured["authorization"] = request.headers["Authorization"]
        captured["payload"] = json.loads(request.content)
        return httpx.Response(
            200,
            json={
                "choices": [
                    {
                        "message": {
                            "content": (
                                "package.png failed because its 83% match is below "
                                "the 90% acceptance threshold."
                            )
                        }
                    }
                ]
            },
        )

    client = httpx.Client(transport=httpx.MockTransport(handler))
    assistant = TCSGenAIQualityAssistant(
        api_key="test-key",
        fallback=RuleBasedQualityAssistant(),
        client=client,
    )

    answer = assistant.answer("Why did package.png fail?", [inspected_batch()])

    assert "package.png failed" in answer
    assert captured["url"] == "https://genailab.tcs.in/chat/completions"
    assert captured["authorization"] == "Bearer test-key"
    payload = captured["payload"]
    assert isinstance(payload, dict)
    assert payload["model"] == "azure_ai/genailab-maas-DeepSeek-V3-0324"
    assert "A108" in payload["messages"][1]["content"]
    assert "package.png" in payload["messages"][1]["content"]


def test_tcs_assistant_falls_back_when_service_is_unavailable() -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        raise httpx.ConnectError("offline", request=request)

    client = httpx.Client(transport=httpx.MockTransport(handler))
    assistant = TCSGenAIQualityAssistant(
        api_key="test-key",
        fallback=RuleBasedQualityAssistant(),
        client=client,
    )

    answer = assistant.answer("What is the confidence of batch A108?", [inspected_batch()])

    assert "TCS GenAI service is temporarily unavailable" in answer
    assert "average AI confidence for batch A108 is 0.83 (83%)" in answer
