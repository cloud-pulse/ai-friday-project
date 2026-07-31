from app.domain.models import Batch, InspectionResult
from app.infrastructure.quality_assistant import RuleBasedQualityAssistant


def inspected_batch(name: str, confidence: float) -> Batch:
    batch = Batch.create(name, "P101", "Morning")
    batch.inspections = [
        InspectionResult(
            "1",
            "package.jpg",
            90,
            90,
            90,
            True,
            [],
            confidence,
            "No anomaly.",
            True,
        )
    ]
    return batch


def test_confidence_question_returns_requested_batch_confidence() -> None:
    assistant = RuleBasedQualityAssistant()
    latest = inspected_batch("A102", 0.75)
    requested = inspected_batch("A101", 0.89)

    answer = assistant.answer(
        "What is the Average AI confidence of batch A101?",
        [latest, requested],
    )

    assert answer == "The average AI confidence for batch A101 is 0.89 (89%)."


def test_confidence_question_uses_latest_when_no_batch_is_named() -> None:
    assistant = RuleBasedQualityAssistant()
    latest = inspected_batch("A102", 0.93)

    answer = assistant.answer("What is the average AI confidence?", [latest])

    assert answer == "The average AI confidence for batch A102 is 0.93 (93%)."


def test_named_unknown_batch_is_reported() -> None:
    assistant = RuleBasedQualityAssistant()

    answer = assistant.answer(
        "What is the confidence of batch A999?",
        [inspected_batch("A101", 0.89)],
    )

    assert answer == "I couldn't find batch A999. Please check the batch name and try again."


def test_image_failure_question_returns_detailed_retrieval_evidence() -> None:
    assistant = RuleBasedQualityAssistant()
    batch = Batch.create("A106", "P101", "Morning")
    batch.inspections = [
        InspectionResult(
            "inspection-1",
            "0198143165548_top.png",
            84,
            84,
            84,
            False,
            [
                "Overall match 84% is below the 90% approved-reference threshold",
                "Package or label layout differs (78% structural match)",
            ],
            0.84,
            (
                "Visual deviation detected against the approved good-image corpus "
                "(required similarity: 90%). Retrieved references: "
                "0137037404616_top.png (84.0%), 0348866877857_top.png (81.0%)."
            ),
            False,
        )
    ]

    answer = assistant.answer(
        "Can you tell why 0198143165548_top.png has failed inspection?",
        [batch],
    )

    assert "failed inspection in batch A106" in answer
    assert "Overall match 84% is below the 90% approved-reference threshold" in answer
    assert "Package or label layout differs (78% structural match)" in answer
    assert "nearest-reference similarity: 84%" in answer
    assert "0137037404616_top.png" not in answer
    assert "Retrieved references" not in answer
    assert "Human validation is required" in answer


def test_unknown_image_filename_is_reported() -> None:
    assistant = RuleBasedQualityAssistant()

    answer = assistant.answer(
        "Why did missing-image.png fail inspection?",
        [inspected_batch("A101", 0.89)],
    )

    assert answer == (
        "I couldn't find an inspection record for missing-image.png. "
        "Please check the image filename and try again."
    )


def test_invalid_image_question_explains_exclusion() -> None:
    assistant = RuleBasedQualityAssistant()
    batch = Batch.create("A107", "P101", "Morning")
    batch.inspections = [
        InspectionResult(
            "inspection-invalid",
            "random.png",
            25,
            80,
            12,
            False,
            ["Invalid image — only 25% reference relevance; minimum 50% is required"],
            0.25,
            "Excluded.",
            False,
            valid_for_inspection=False,
        )
    ]

    answer = assistant.answer("Why was random.png rejected?", [batch])

    assert "rejected as an invalid inspection image" in answer
    assert "excluded from the batch quality score" in answer
    assert "no packaging defect assessment was performed" in answer
