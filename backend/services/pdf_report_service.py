"""Professional ReportLab PDF export for inspection reports."""

from pathlib import Path
from typing import Any

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

from schemas.reports import ReportDraft


class PDFReportService:
    """Renders a clear enterprise-quality report using the locked design colors."""

    _NAVY = colors.HexColor("#075985")
    _SKY = colors.HexColor("#0EA5E9")
    _TEAL = colors.HexColor("#10B981")
    _WARNING = colors.HexColor("#F59E0B")
    _DANGER = colors.HexColor("#EF4444")

    def generate(self, destination: Path, aggregate: dict[str, Any], draft: ReportDraft, approval_status: str) -> None:
        destination.parent.mkdir(parents=True, exist_ok=True)
        document = SimpleDocTemplate(str(destination), pagesize=A4, rightMargin=18 * mm, leftMargin=18 * mm, topMargin=18 * mm, bottomMargin=18 * mm)
        styles = getSampleStyleSheet()
        title = ParagraphStyle("ReportTitle", parent=styles["Title"], textColor=self._NAVY, alignment=TA_CENTER, fontSize=20, leading=24)
        heading = ParagraphStyle("Section", parent=styles["Heading2"], textColor=self._NAVY, spaceBefore=12, spaceAfter=6)
        body = ParagraphStyle("Body", parent=styles["BodyText"], leading=15, spaceAfter=5)
        story = [Paragraph("PharmaInspect AI", title), Paragraph("Pharmaceutical Packaging Inspection Report", styles["Heading3"]), Spacer(1, 6 * mm)]
        batch = aggregate["batch"]
        story += [Paragraph("Batch Information", heading), self._table([["Batch", batch["name"]], ["Production line", batch["production_line"]], ["Shift", batch["shift"]], ["Approval status", approval_status.title()]])] 
        summary = aggregate["inspection_summary"]
        story += [Paragraph("Inspection Summary", heading), self._table([["Images processed", str(summary["images_processed"])], ["Passed", str(summary["passed"])], ["Failed", str(summary["failed"])], ["Needs review", str(summary["needs_review"])], ["Detected defects", ", ".join(f"{name}: {count}" for name, count in summary["defect_counts"].items()) or "None"]])]
        metrics = aggregate["quality_metrics"]
        story += [Paragraph("Quality Metrics", heading), self._table([["Overall quality", f"{metrics['overall']}%"], ["Packaging integrity", f"{metrics['packaging_integrity']}%"], ["Label accuracy", f"{metrics['label_accuracy']}%"], ["Seal quality", f"{metrics['seal_quality']}%"]])]
        story += [Paragraph("AI Findings", heading), Paragraph(draft.executive_summary, body), *[Paragraph(f"• {finding}", body) for finding in draft.ai_findings]]
        review = aggregate["inspector_review"]
        story += [Paragraph("Inspector Review", heading), self._table([["Inspector", review["inspector_name"]], ["Notes", review.get("notes") or "None"], ["Root cause", review.get("root_cause") or "Not recorded"], ["Final decision", review["decision"].replace("_", " ").title()]])]
        corrective_actions = [Paragraph(f"• {action}", body) for action in review["corrective_actions"]]
        story += [Paragraph("Corrective Actions", heading), *(corrective_actions or [Paragraph("No corrective actions recorded.", body)])]
        story += [Paragraph("Final Recommendation", heading), Paragraph(draft.final_recommendation, body), Paragraph(f"Final approval: <b>{approval_status.title()}</b>", body)]
        document.build(story)

    def _table(self, rows: list[list[str]]) -> Table:
        table = Table(rows, colWidths=[48 * mm, 116 * mm])
        table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F0F9FF")),
            ("TEXTCOLOR", (0, 0), (0, -1), self._NAVY),
            ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
            ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#E0F2FE")),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("PADDING", (0, 0), (-1, -1), 7),
        ]))
        return table
