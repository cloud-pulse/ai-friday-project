"""Dependency providers for API route handlers."""

from functools import lru_cache

from config.settings import settings
from database.lancedb import (
    BatchRepository,
    ChatMessageRepository,
    ChatSessionRepository,
    EmbeddingRepository,
    ImageRepository,
    LanceDBClient,
    ReportRepository,
    ResultRepository,
    ReviewRepository,
)
from services.chat_service import ChatService
from services.embedding_service import EmbeddingService
from services.image_preprocessing import ImagePreprocessor
from services.inspection_service import InspectionService
from services.ocr_service import OCRService
from services.pdf_report_service import PDFReportService
from services.quality_score_service import QualityScoreService
from services.report_aggregation_service import ReportAggregationService
from services.report_ai_service import ReportAIService
from services.report_service import ReportService
from services.review_service import ReviewService
from services.system_service import SystemService
from services.vision_service import VisionModelService


@lru_cache
def get_system_service() -> SystemService:
    """Provide the shared system service instance."""
    return SystemService()


@lru_cache
def get_lancedb_client() -> LanceDBClient:
    client = LanceDBClient()
    client.initialize()
    return client


@lru_cache
def get_embedding_service() -> EmbeddingService:
    client = get_lancedb_client()
    return EmbeddingService(EmbeddingRepository(client))


@lru_cache
def get_inspection_service() -> InspectionService:
    """Provide the composed single-image inspection workflow."""
    client = get_lancedb_client()
    return InspectionService(
        batch_repository=BatchRepository(client),
        image_repository=ImageRepository(client),
        result_repository=ResultRepository(client),
        preprocessor=ImagePreprocessor(),
        ocr_service=OCRService(),
        vision_service=VisionModelService(),
        quality_score_service=QualityScoreService(),
        uploads_dir=settings.uploads_dir,
        max_upload_bytes=settings.max_upload_bytes,
        embedding_service=get_embedding_service(),
    )


@lru_cache
def get_chat_service() -> ChatService:
    client = get_lancedb_client()
    return ChatService(
        session_repository=ChatSessionRepository(client),
        message_repository=ChatMessageRepository(client),
        embedding_repository=EmbeddingRepository(client),
        embedding_service=get_embedding_service(),
    )


@lru_cache
def get_review_service() -> ReviewService:
    client = get_lancedb_client()
    return ReviewService(BatchRepository(client), ReviewRepository(client))


@lru_cache
def get_report_service() -> ReportService:
    client = get_lancedb_client()
    return ReportService(
        batch_repository=BatchRepository(client),
        result_repository=ResultRepository(client),
        report_repository=ReportRepository(client),
        review_service=get_review_service(),
        aggregation_service=ReportAggregationService(),
        report_ai_service=ReportAIService(),
        pdf_service=PDFReportService(),
        reports_dir=settings.reports_dir,
    )



