"""LanceDB connection and table initialization."""

from collections.abc import Mapping
from pathlib import Path

import lancedb
import pyarrow as pa

from config.settings import settings


class LanceDBClient:
    """Owns the local LanceDB connection and stable table schemas."""

    BATCHES = "inspection_batches"
    IMAGES = "inspection_images"
    RESULTS = "inspection_results"
    REVIEWS = "inspector_reviews"
    REPORTS = "report_metadata"
    EMBEDDINGS = "embeddings"
    CHAT_SESSIONS = "chat_sessions"
    CHAT_MESSAGES = "chat_messages"

    def __init__(self, uri: Path | str | None = None, *, embedding_dimensions: int | None = None) -> None:
        self.uri = Path(uri or settings.lancedb_dir)
        self.uri.mkdir(parents=True, exist_ok=True)
        self.embedding_dimensions = embedding_dimensions or settings.embedding_dimensions
        if self.embedding_dimensions < 1:
            raise ValueError("embedding_dimensions must be positive")
        self.connection = lancedb.connect(self.uri)

    @property
    def schemas(self) -> Mapping[str, pa.Schema]:
        return {
            self.BATCHES: pa.schema([
                pa.field("id", pa.string()), pa.field("name", pa.string()),
                pa.field("production_line", pa.string()), pa.field("shift", pa.string()),
                pa.field("notes", pa.string()), pa.field("status", pa.string()),
                pa.field("created_at", pa.string()), pa.field("updated_at", pa.string()),
            ]),
            self.IMAGES: pa.schema([
                pa.field("id", pa.string()), pa.field("batch_id", pa.string()),
                pa.field("storage_path", pa.string()), pa.field("filename", pa.string()),
                pa.field("media_type", pa.string()), pa.field("size_bytes", pa.int64()),
                pa.field("created_at", pa.string()),
            ]),
            self.RESULTS: pa.schema([
                pa.field("id", pa.string()), pa.field("batch_id", pa.string()), pa.field("image_id", pa.string()),
                pa.field("decision", pa.string()), pa.field("defects_json", pa.string()),
                pa.field("ocr_result_json", pa.string()), pa.field("quality_score_json", pa.string()),
                pa.field("ai_summary_json", pa.string()), pa.field("structured_inspection_json", pa.string()),
                pa.field("created_at", pa.string()), pa.field("updated_at", pa.string()),
            ]),
            self.REVIEWS: pa.schema([
                pa.field("id", pa.string()), pa.field("batch_id", pa.string()), pa.field("inspector_name", pa.string()),
                pa.field("notes", pa.string()), pa.field("root_cause", pa.string()),
                pa.field("corrective_actions_json", pa.string()), pa.field("decision", pa.string()),
                pa.field("approved_at", pa.string()), pa.field("created_at", pa.string()), pa.field("updated_at", pa.string()),
            ]),
            self.REPORTS: pa.schema([
                pa.field("id", pa.string()), pa.field("batch_id", pa.string()), pa.field("status", pa.string()),
                pa.field("storage_path", pa.string()), pa.field("generated_at", pa.string()),
                pa.field("approved_by", pa.string()), pa.field("approved_at", pa.string()),
                pa.field("created_at", pa.string()), pa.field("updated_at", pa.string()),
            ]),
            self.EMBEDDINGS: pa.schema([
                pa.field("id", pa.string()), pa.field("batch_id", pa.string()), pa.field("source_type", pa.string()),
                pa.field("source_id", pa.string()), pa.field("content", pa.string()),
                pa.field("vector", pa.list_(pa.float32(), self.embedding_dimensions)),
                pa.field("created_at", pa.string()),
            ]),
            self.CHAT_SESSIONS: pa.schema([
                pa.field("id", pa.string()), pa.field("batch_id", pa.string()),
                pa.field("title", pa.string()), pa.field("summary", pa.string()),
                pa.field("created_at", pa.string()), pa.field("updated_at", pa.string()),
            ]),
            self.CHAT_MESSAGES: pa.schema([
                pa.field("id", pa.string()), pa.field("session_id", pa.string()),
                pa.field("role", pa.string()), pa.field("content", pa.string()),
                pa.field("created_at", pa.string()),
            ]),
        }

    def initialize(self) -> None:
        """Create every required table if it does not already exist."""
        existing = set(self.connection.table_names())
        for name, schema in self.schemas.items():
            if name not in existing:
                self.connection.create_table(name, schema=schema)

    def table(self, name: str):
        self.initialize()
        if name not in self.schemas:
            raise ValueError(f"Unknown LanceDB table: {name}")
        return self.connection.open_table(name)
