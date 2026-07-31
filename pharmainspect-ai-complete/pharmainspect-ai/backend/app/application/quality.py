from app.domain.models import Batch


def batch_metrics(batch: Batch) -> dict[str, object]:
    total = len(batch.inspections)
    valid_inspections = [
        item for item in batch.inspections if item.valid_for_inspection
    ]
    valid_total = len(valid_inspections)
    invalid = total - valid_total
    passed = sum(item.passed for item in valid_inspections)
    failed = valid_total - passed
    if total == 0:
        return {
            "images_processed": 0,
            "invalid": 0,
            "passed": 0,
            "failed": 0,
            "quality_score": 0,
            "packaging_integrity": 0,
            "label_accuracy": 0,
            "seal_quality": 0,
            "average_confidence": 0,
            "defect_counts": {},
        }

    defect_counts: dict[str, int] = {}
    for inspection in valid_inspections:
        for defect in inspection.defects:
            defect_counts[defect] = defect_counts.get(defect, 0) + 1

    if valid_total == 0:
        return {
            "images_processed": total,
            "invalid": invalid,
            "passed": 0,
            "failed": 0,
            "quality_score": 0,
            "packaging_integrity": 0,
            "label_accuracy": 0,
            "seal_quality": 0,
            "average_confidence": 0,
            "defect_counts": {},
        }

    return {
        "images_processed": total,
        "invalid": invalid,
        "passed": passed,
        "failed": failed,
        "quality_score": round(100 * passed / valid_total),
        "packaging_integrity": round(sum(x.packaging_integrity for x in valid_inspections) / valid_total),
        "label_accuracy": round(sum(x.label_accuracy for x in valid_inspections) / valid_total),
        "seal_quality": round(sum(x.seal_quality for x in valid_inspections) / valid_total),
        "average_confidence": round(sum(x.confidence for x in valid_inspections) / valid_total, 2),
        "defect_counts": defect_counts,
    }
