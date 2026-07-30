"""Repository pattern implementations for LanceDB persistence."""

import json
from collections.abc import Callable
from datetime import datetime, timezone
from typing import Any, Generic, TypeVar
from uuid import UUID

from pydantic import BaseModel

from database.lancedb.client import LanceDBClient
from models.chat import ChatMessage, ChatSession
from models.inspection import (
    EmbeddingRecord,
    EmbeddingSearchHit,
    InspectionBatch,
    InspectionImage,
    InspectionResult,
    InspectorReview,
    ReportMetadata,
)


ModelT = TypeVar("ModelT", bound=BaseModel)


def _json(value: Any) -> str:
    return json.dumps(value, separators=(",", ":"), sort_keys=True, default=str)


def _load(value: str) -> Any:
    return json.loads(value)


def _timestamp() -> datetime:
    return datetime.now(timezone.utc)


class BaseRepository(Generic[ModelT]):
    """Base CRUD operations shared by typed LanceDB repositories."""

    def __init__(
        self,
        client: LanceDBClient,
        table_name: str,
        model_type: type[ModelT],
        to_record: Callable[[ModelT], dict[str, Any]],
        from_record: Callable[[dict[str, Any]], ModelT],
    ) -> None:
        self._client = client
        self._table_name = table_name
        self._model_type = model_type
        self._to_record = to_record
        self._from_record = from_record

    @property
    def table(self):
        return self._client.table(self._table_name)

    def create(self, entity: ModelT) -> ModelT:
        self.table.add([self._to_record(entity)])
        return entity

    def get(self, entity_id: UUID) -> ModelT | None:
        records = self.table.search().where(f"id = '{entity_id}'").limit(1).to_list()
        return self._from_record(records[0]) if records else None

    def list_by_batch(self, batch_id: UUID, *, limit: int = 100) -> list[ModelT]:
        records = self.table.search().where(f"batch_id = '{batch_id}'").limit(limit).to_list()
        return [self._from_record(record) for record in records]

    def delete(self, entity_id: UUID) -> None:
        self.table.delete(f"id = '{entity_id}'")

    def update(self, entity_id: UUID, **changes: Any) -> ModelT | None:
        current = self.get(entity_id)
        if current is None:
            return None
        changes["updated_at"] = _timestamp()
        updated = self._model_type.model_validate({**current.model_dump(), **changes})
        self.table.update(where=f"id = '{entity_id}'", values=self._to_record(updated))
        return updated


def _plain_record(entity: BaseModel) -> dict[str, Any]:
    return entity.model_dump(mode="json")


class BatchRepository(BaseRepository[InspectionBatch]):
    def __init__(self, client: LanceDBClient) -> None:
        super().__init__(client, LanceDBClient.BATCHES, InspectionBatch, _plain_record, InspectionBatch.model_validate)

    def history(self, *, limit: int = 100) -> list[InspectionBatch]:
        records = self.table.search().limit(10_000).to_list()
        batches = [InspectionBatch.model_validate(record) for record in records]
        return sorted(batches, key=lambda batch: batch.created_at, reverse=True)[:limit]


class ImageRepository(BaseRepository[InspectionImage]):
    def __init__(self, client: LanceDBClient) -> None:
        super().__init__(client, LanceDBClient.IMAGES, InspectionImage, _plain_record, InspectionImage.model_validate)


def _result_record(result: InspectionResult) -> dict[str, Any]:
    return {
        "id": str(result.id), "batch_id": str(result.batch_id), "image_id": str(result.image_id),
        "decision": result.decision.value, "defects_json": _json([item.model_dump(mode="json") for item in result.defects]),
        "ocr_result_json": _json(result.ocr_result.model_dump(mode="json")),
        "quality_score_json": _json(result.quality_score.model_dump(mode="json")),
        "ai_summary_json": _json(result.ai_summary.model_dump(mode="json")),
        "structured_inspection_json": _json(result.structured_inspection),
        "created_at": result.created_at.isoformat(), "updated_at": result.updated_at.isoformat(),
    }


def _result_model(record: dict[str, Any]) -> InspectionResult:
    return InspectionResult.model_validate({
        "id": record["id"], "batch_id": record["batch_id"], "image_id": record["image_id"],
        "decision": record["decision"], "defects": _load(record["defects_json"]),
        "ocr_result": _load(record["ocr_result_json"]), "quality_score": _load(record["quality_score_json"]),
        "ai_summary": _load(record["ai_summary_json"]),
        "structured_inspection": _load(record["structured_inspection_json"]),
        "created_at": record["created_at"], "updated_at": record["updated_at"],
    })


class ResultRepository(BaseRepository[InspectionResult]):
    def __init__(self, client: LanceDBClient) -> None:
        super().__init__(client, LanceDBClient.RESULTS, InspectionResult, _result_record, _result_model)

    def for_image(self, image_id: UUID) -> InspectionResult | None:
        records = self.table.search().where(f"image_id = '{image_id}'").limit(1).to_list()
        return _result_model(records[0]) if records else None


def _review_record(review: InspectorReview) -> dict[str, Any]:
    record = review.model_dump(mode="json")
    record["corrective_actions_json"] = _json(record.pop("corrective_actions"))
    return record


def _review_model(record: dict[str, Any]) -> InspectorReview:
    record = dict(record)
    record["corrective_actions"] = _load(record.pop("corrective_actions_json"))
    return InspectorReview.model_validate(record)


class ReviewRepository(BaseRepository[InspectorReview]):
    def __init__(self, client: LanceDBClient) -> None:
        super().__init__(client, LanceDBClient.REVIEWS, InspectorReview, _review_record, _review_model)


class ReportRepository(BaseRepository[ReportMetadata]):
    def __init__(self, client: LanceDBClient) -> None:
        super().__init__(client, LanceDBClient.REPORTS, ReportMetadata, _plain_record, ReportMetadata.model_validate)


def _embedding_record(embedding: EmbeddingRecord) -> dict[str, Any]:
    return {
        "id": str(embedding.id), "batch_id": str(embedding.batch_id),
        "source_type": embedding.source_type, "source_id": str(embedding.source_id),
        "content": embedding.content, "vector": embedding.vector,
        "created_at": embedding.created_at.isoformat(),
    }


def _embedding_model(record: dict[str, Any]) -> EmbeddingRecord:
    return EmbeddingRecord.model_validate(record)


class EmbeddingRepository(BaseRepository[EmbeddingRecord]):
    def __init__(self, client: LanceDBClient) -> None:
        super().__init__(client, LanceDBClient.EMBEDDINGS, EmbeddingRecord, _embedding_record, _embedding_model)

    def create(self, entity: EmbeddingRecord) -> EmbeddingRecord:
        if len(entity.vector) != self._client.embedding_dimensions:
            raise ValueError(f"Expected a {self._client.embedding_dimensions}-dimension embedding vector.")
        return super().create(entity)

    def search(
        self, query_vector: list[float], *, limit: int = 5, batch_id: UUID | None = None
    ) -> list[EmbeddingSearchHit]:
        if len(query_vector) != self._client.embedding_dimensions:
            raise ValueError(f"Expected a {self._client.embedding_dimensions}-dimension query vector.")
        query = self.table.search(query_vector, vector_column_name="vector").limit(limit)
        if batch_id is not None:
            query = query.where(f"batch_id = '{batch_id}'")
        return [
            EmbeddingSearchHit(
                id=record["id"], batch_id=record["batch_id"], source_type=record["source_type"],
                source_id=record["source_id"], content=record["content"], distance=record["_distance"],
            )
            for record in query.to_list()
        ]


def _session_record(session: ChatSession) -> dict[str, Any]:
    return {
        "id": str(session.id),
        "batch_id": str(session.batch_id) if session.batch_id else "",
        "title": session.title,
        "summary": session.summary,
        "created_at": session.created_at.isoformat(),
        "updated_at": session.updated_at.isoformat(),
    }


def _session_model(record: dict[str, Any]) -> ChatSession:
    batch_id_str = record.get("batch_id")
    return ChatSession.model_validate({
        "id": record["id"],
        "batch_id": batch_id_str if batch_id_str else None,
        "title": record["title"],
        "summary": record.get("summary", ""),
        "created_at": record["created_at"],
        "updated_at": record["updated_at"],
    })


class ChatSessionRepository(BaseRepository[ChatSession]):
    def __init__(self, client: LanceDBClient) -> None:
        super().__init__(client, LanceDBClient.CHAT_SESSIONS, ChatSession, _session_record, _session_model)

    def list_recent(self, *, limit: int = 50) -> list[ChatSession]:
        records = self.table.search().limit(10_000).to_list()
        sessions = [_session_model(record) for record in records]
        return sorted(sessions, key=lambda s: s.updated_at, reverse=True)[:limit]


def _message_record(msg: ChatMessage) -> dict[str, Any]:
    return {
        "id": str(msg.id),
        "session_id": str(msg.session_id),
        "role": msg.role.value if hasattr(msg.role, "value") else str(msg.role),
        "content": msg.content,
        "created_at": msg.created_at.isoformat(),
    }


def _message_model(record: dict[str, Any]) -> ChatMessage:
    return ChatMessage.model_validate(record)


class ChatMessageRepository(BaseRepository[ChatMessage]):
    def __init__(self, client: LanceDBClient) -> None:
        super().__init__(client, LanceDBClient.CHAT_MESSAGES, ChatMessage, _message_record, _message_model)

    def list_by_session(self, session_id: UUID, *, limit: int = 100) -> list[ChatMessage]:
        records = self.table.search().where(f"session_id = '{session_id}'").limit(limit).to_list()
        messages = [_message_model(record) for record in records]
        return sorted(messages, key=lambda m: m.created_at)

