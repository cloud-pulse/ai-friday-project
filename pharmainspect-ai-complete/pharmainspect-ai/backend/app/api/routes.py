from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import Response

from app.application.services import AssistantService, BatchService, ReportService, serialize_batch
from app.schemas.api import BatchCreate, ChatRequest, ReviewRequest


def create_router(batch_service: BatchService, report_service: ReportService, assistant_service: AssistantService) -> APIRouter:
    router = APIRouter(prefix="/api")

    @router.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}

    @router.get("/dashboard")
    def dashboard() -> dict[str, object]:
        return batch_service.dashboard()

    @router.get("/batches")
    def list_batches() -> list[dict[str, object]]:
        return [serialize_batch(x) for x in batch_service.list()]

    @router.post("/batches", status_code=201)
    def create_batch(payload: BatchCreate) -> dict[str, object]:
        return serialize_batch(batch_service.create(**payload.model_dump()))

    @router.get("/batches/{batch_id}")
    def get_batch(batch_id: str) -> dict[str, object]:
        try:
            return serialize_batch(batch_service.require(batch_id))
        except KeyError as exc:
            raise HTTPException(404, "Batch not found") from exc

    @router.post("/batches/{batch_id}/analyze")
    async def analyze_batch(batch_id: str, files: list[UploadFile] = File(...)) -> dict[str, object]:
        allowed = {"image/jpeg", "image/png", "image/webp"}
        if not files:
            raise HTTPException(400, "At least one image is required")
        prepared: list[tuple[str, bytes]] = []
        for file in files:
            if file.content_type not in allowed:
                raise HTTPException(415, f"Unsupported file type: {file.content_type}")
            content = await file.read()
            if len(content) > 10 * 1024 * 1024:
                raise HTTPException(413, f"File too large: {file.filename}")
            prepared.append((file.filename or "image", content))
        try:
            return serialize_batch(batch_service.analyze(batch_id, prepared))
        except KeyError as exc:
            raise HTTPException(404, "Batch not found") from exc

    @router.put("/batches/{batch_id}/review")
    def review_batch(batch_id: str, payload: ReviewRequest) -> dict[str, object]:
        try:
            return serialize_batch(batch_service.review(batch_id, **payload.model_dump()))
        except KeyError as exc:
            raise HTTPException(404, "Batch not found") from exc

    @router.get("/batches/{batch_id}/report")
    def report(batch_id: str) -> Response:
        try:
            content = report_service.generate(batch_id)
        except KeyError as exc:
            raise HTTPException(404, "Batch not found") from exc
        return Response(content, media_type="application/pdf", headers={"Content-Disposition": f'attachment; filename="inspection-{batch_id}.pdf"'})

    @router.post("/assistant")
    def assistant(payload: ChatRequest) -> dict[str, str]:
        return {"answer": assistant_service.answer(payload.question)}

    return router
