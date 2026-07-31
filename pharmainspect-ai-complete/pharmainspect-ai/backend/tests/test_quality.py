from unittest.mock import Mock

from app.application.quality import batch_metrics
from app.application.services import AssistantService
from app.domain.models import Batch, InspectionResult


def test_quality_metrics_are_deterministic() -> None:
    batch = Batch.create("A", "L1", "Morning")
    batch.inspections = [
        InspectionResult("1", "a.jpg", 95, 90, 98, True, [], 0.95, "ok", True),
        InspectionResult("2", "b.jpg", 80, 75, 90, True, ["Broken Seal"], 0.88, "bad", False),
    ]
    metrics = batch_metrics(batch)
    assert metrics["quality_score"] == 50
    assert metrics["defect_counts"] == {"Broken Seal": 1}


def test_invalid_images_are_excluded_from_quality_metrics() -> None:
    batch = Batch.create("A", "L1", "Morning")
    batch.inspections = [
        InspectionResult("1", "passed.jpg", 95, 90, 98, True, [], 0.95, "ok", True),
        InspectionResult("2", "failed.jpg", 80, 75, 90, True, ["Broken Seal"], 0.88, "bad", False),
        InspectionResult(
            "3",
            "random.png",
            10,
            10,
            10,
            False,
            ["Invalid image"],
            0.1,
            "excluded",
            False,
            valid_for_inspection=False,
        ),
    ]

    metrics = batch_metrics(batch)

    assert metrics["images_processed"] == 3
    assert metrics["invalid"] == 1
    assert metrics["passed"] == 1
    assert metrics["failed"] == 1
    assert metrics["quality_score"] == 50
    assert metrics["defect_counts"] == {"Broken Seal": 1}


def test_assistant_rejects_irrelevant_questions() -> None:
    repository = Mock()
    assistant = Mock()
    service = AssistantService(repository, assistant)

    answers = [
        service.answer("What is the capital of France?"),
        service.answer("What is the square root of 16?"),
    ]

    assert all("not within my scope" in answer for answer in answers)
    assert all("pharmaceutical packaging inspections" in answer for answer in answers)
    repository.list.assert_not_called()
    assistant.answer.assert_not_called()


def test_assistant_accepts_quality_questions() -> None:
    repository = Mock()
    repository.list.return_value = []
    assistant = Mock()
    assistant.answer.return_value = "No inspection batches are available yet."
    service = AssistantService(repository, assistant)

    answer = service.answer("Why did the latest batch fail inspection?")

    assert answer == "No inspection batches are available yet."
    assistant.answer.assert_called_once_with(
        "Why did the latest batch fail inspection?",
        [],
    )


def test_assistant_accepts_an_image_filename_question() -> None:
    repository = Mock()
    repository.list.return_value = []
    assistant = Mock()
    assistant.answer.return_value = "Image details"
    service = AssistantService(repository, assistant)

    answer = service.answer("Why did 0198143165548_top.png fail?")

    assert answer == "Image details"
