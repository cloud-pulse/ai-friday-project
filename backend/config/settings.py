"""Environment-based application settings."""

import os
from dataclasses import dataclass
from pathlib import Path


def _parse_origins(value: str) -> list[str]:
    return [origin.strip() for origin in value.split(",") if origin.strip()]


@dataclass(frozen=True, slots=True)
class Settings:
    """Immutable runtime configuration loaded from environment variables."""

    app_name: str
    app_version: str
    environment: str
    debug: bool
    api_v1_prefix: str
    cors_origins: list[str]
    log_level: str
    base_dir: Path
    uploads_dir: Path
    reports_dir: Path
    lancedb_dir: Path
    embedding_dimensions: int
    max_upload_bytes: int
    vision_base_url: str
    vision_api_path: str
    vision_model: str
    vision_api_key: str | None
    vision_timeout_seconds: float
    ai_verify_ssl: bool
    report_model: str
    embedding_model: str
    embedding_api_path: str
    chat_model: str
    rag_top_k: int


def get_settings() -> Settings:
    base_dir = Path(__file__).resolve().parent.parent
    return Settings(
        app_name=os.getenv("APP_NAME", "PharmaInspect AI API"),
        app_version=os.getenv("APP_VERSION", "0.1.0"),
        environment=os.getenv("ENVIRONMENT", "development"),
        debug=os.getenv("DEBUG", "false").lower() == "true",
        api_v1_prefix=os.getenv("API_V1_PREFIX", "/api/v1"),
        cors_origins=_parse_origins(os.getenv("CORS_ORIGINS", "http://localhost:5173")),
        log_level=os.getenv("LOG_LEVEL", "INFO").upper(),
        base_dir=base_dir,
        uploads_dir=base_dir / "uploads",
        reports_dir=base_dir / "reports",
        lancedb_dir=base_dir / "database" / "lancedb",
        embedding_dimensions=int(os.getenv("EMBEDDING_DIMENSIONS", "3072")),
        max_upload_bytes=int(os.getenv("MAX_UPLOAD_BYTES", "10485760")),
        vision_base_url=os.getenv("VISION_BASE_URL", "https://genailab.tcs.in"),
        vision_api_path=os.getenv("VISION_API_PATH", "/v1/chat/completions"),
        vision_model=os.getenv("VISION_MODEL", "azure_ai/genailab-maas-Llama-3.2-90B-Vision-Instruct"),
        vision_api_key=os.getenv("VISION_API_KEY", "sk-7zJ9xEWDywrq4YSIDTB-eg"),
        vision_timeout_seconds=float(os.getenv("VISION_TIMEOUT_SECONDS", "60")),
        ai_verify_ssl=os.getenv("AI_VERIFY_SSL", "true").lower() == "true",
        report_model=os.getenv("REPORT_MODEL", "azure/genailab-maas-gpt-4o"),
        embedding_model=os.getenv("EMBEDDING_MODEL", "azure/genailab-maas-text-embedding-3-large"),
        embedding_api_path=os.getenv("EMBEDDING_API_PATH", "/v1/embeddings"),
        chat_model=os.getenv("CHAT_MODEL", "azure_ai/genailab-maas-Llama-3.3-70B-Instruct"),
        rag_top_k=int(os.getenv("RAG_TOP_K", "5")),
    )


settings = get_settings()
