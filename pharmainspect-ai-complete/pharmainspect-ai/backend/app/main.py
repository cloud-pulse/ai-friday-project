import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import create_router
from app.application.services import AssistantService, BatchService, ReportService
from app.infrastructure.adapters import (
    DeterministicVisionInspector,
    InMemoryBatchRepository,
    ReportLabReportGenerator,
)
from app.infrastructure.image_rag import ImageRAGVisionInspector
from app.infrastructure.quality_assistant import RuleBasedQualityAssistant
from app.infrastructure.tcs_ai import TCSGenAIQualityAssistant

DEFAULT_GOOD_IMAGES_DIR = Path(r"C:\Users\GenAIHYDADBUSR103\Desktop\Images\data\good")
good_images_dir = Path(os.getenv("PHARMA_GOOD_IMAGES_DIR", str(DEFAULT_GOOD_IMAGES_DIR)))
similarity_threshold = float(os.getenv("PHARMA_GOOD_IMAGE_THRESHOLD", "0.90"))
relevance_threshold = float(os.getenv("PHARMA_IMAGE_RELEVANCE_THRESHOLD", "0.50"))
tcs_ai_api_key = os.getenv("TCS_AI_API_KEY", "")
tcs_ai_base_url = os.getenv("TCS_AI_BASE_URL", "https://genailab.tcs.in")
tcs_ai_model = os.getenv(
    "TCS_AI_MODEL",
    "azure_ai/genailab-maas-DeepSeek-V3-0324",
)
tcs_ai_verify_ssl = os.getenv("TCS_AI_VERIFY_SSL", "false").casefold() == "true"

repository = InMemoryBatchRepository()
vision_inspector = (
    ImageRAGVisionInspector(
        good_images_dir,
        similarity_threshold=similarity_threshold,
        relevance_threshold=relevance_threshold,
    )
    if good_images_dir.is_dir()
    else DeterministicVisionInspector()
)
batch_service = BatchService(repository, vision_inspector)
report_service = ReportService(repository, ReportLabReportGenerator())
local_quality_assistant = RuleBasedQualityAssistant()
quality_assistant = (
    TCSGenAIQualityAssistant(
        api_key=tcs_ai_api_key,
        base_url=tcs_ai_base_url,
        model=tcs_ai_model,
        verify_ssl=tcs_ai_verify_ssl,
        fallback=local_quality_assistant,
    )
    if tcs_ai_api_key
    else local_quality_assistant
)
assistant_service = AssistantService(repository, quality_assistant)

app = FastAPI(title="PharmaInspect AI API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(create_router(batch_service, report_service, assistant_service))
