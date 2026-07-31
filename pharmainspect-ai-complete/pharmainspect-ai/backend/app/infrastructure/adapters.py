from __future__ import annotations

import hashlib
import io
from uuid import uuid4

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

from app.application.quality import batch_metrics
from app.domain.models import Batch, InspectionResult


class InMemoryBatchRepository:
    def __init__(self) -> None:
        self._items: dict[str, Batch] = {}

    def save(self, batch: Batch) -> Batch:
        self._items[batch.id] = batch
        return batch

    def get(self, batch_id: str) -> Batch | None:
        return self._items.get(batch_id)

    def list(self) -> list[Batch]:
        return sorted(self._items.values(), key=lambda x: x.created_at, reverse=True)


class DeterministicVisionInspector:
    """Offline demo adapter. Replace with OpenCV/EasyOCR/Azure Vision implementation."""

    DEFECTS = ["Broken Seal", "Wrong Label", "Damaged Packaging", "Unreadable Expiry"]

    def inspect(self, image_name: str, image_bytes: bytes) -> InspectionResult:
        digest = hashlib.sha256(image_name.encode() + image_bytes[:1024]).digest()
        packaging = 78 + digest[0] % 23
        seal = 75 + digest[1] % 26
        label = 80 + digest[2] % 21
        confidence = round(0.78 + (digest[3] % 21) / 100, 2)
        defects = [self.DEFECTS[i] for i in range(4) if digest[4 + i] % 10 < 2]
        passed = min(packaging, seal, label) >= 85 and not defects
        if not passed and not defects:
            defects = [self.DEFECTS[digest[8] % len(self.DEFECTS)]]
        summary = "No visible packaging anomaly detected." if passed else f"Potential issue detected: {', '.join(defects)}. Human review required."
        return InspectionResult(
            id=str(uuid4()),
            image_name=image_name,
            packaging_integrity=packaging,
            seal_quality=seal,
            label_accuracy=label,
            ocr_verified=label >= 85,
            defects=defects,
            confidence=confidence,
            ai_summary=summary,
            passed=passed,
        )


class ReportLabReportGenerator:
    def generate_pdf(self, batch: Batch) -> bytes:
        output = io.BytesIO()
        doc = SimpleDocTemplate(output, pagesize=A4, rightMargin=18 * mm, leftMargin=18 * mm)
        styles = getSampleStyleSheet()
        metrics = batch_metrics(batch)
        story = [
            Paragraph("PharmaInspect AI — Inspection Report", styles["Title"]),
            Spacer(1, 8),
            Paragraph(f"Batch: {batch.name}", styles["Heading2"]),
            Paragraph(f"Production line: {batch.production_line} | Shift: {batch.shift}", styles["BodyText"]),
            Spacer(1, 10),
        ]
        data = [
            ["Images", metrics["images_processed"], "Passed", metrics["passed"]],
            ["Failed", metrics["failed"], "Quality Score", f'{metrics["quality_score"]}%'],
            ["Packaging", f'{metrics["packaging_integrity"]}%', "Seal", f'{metrics["seal_quality"]}%'],
            ["Label", f'{metrics["label_accuracy"]}%', "Confidence", metrics["average_confidence"]],
        ]
        table = Table(data, colWidths=[36 * mm, 28 * mm, 36 * mm, 28 * mm])
        table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F0F9FF")),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E0F2FE")),
            ("TEXTCOLOR", (0, 0), (-1, -1), colors.HexColor("#075985")),
            ("PADDING", (0, 0), (-1, -1), 8),
        ]))
        story += [table, Spacer(1, 14), Paragraph("AI Findings", styles["Heading2"])]
        findings = "<br/>".join(f"• {x.image_name}: {x.ai_summary}" for x in batch.inspections[:12]) or "No findings."
        story += [Paragraph(findings, styles["BodyText"]), Spacer(1, 12), Paragraph("Inspector Review", styles["Heading2"])]
        story += [Paragraph(batch.review.inspector_notes or "Not provided", styles["BodyText"])]
        story += [Paragraph(f"Root cause: {batch.review.root_cause or 'Not provided'}", styles["BodyText"])]
        story += [Paragraph(f"Corrective actions: {batch.review.corrective_actions or 'Not provided'}", styles["BodyText"])]
        story += [Paragraph(f"Final decision: {batch.review.decision}", styles["Heading2"])]
        doc.build(story)
        return output.getvalue()
