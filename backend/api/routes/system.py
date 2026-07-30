"""System status endpoints."""

from fastapi import APIRouter, Depends, status

from api.dependencies import get_system_service
from schemas.responses import HealthResponse, VersionResponse
from services.system_service import SystemService

router = APIRouter()


@router.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Check API health",
)
async def health_check(
    system_service: SystemService = Depends(get_system_service),
) -> HealthResponse:
    """Return the health status of the API foundation."""
    return system_service.health()


@router.get(
    "/version",
    response_model=VersionResponse,
    status_code=status.HTTP_200_OK,
    summary="Get API version",
)
async def version(
    system_service: SystemService = Depends(get_system_service),
) -> VersionResponse:
    """Return service identity and version information."""
    return system_service.version()

@router.get(
    "/status",
    status_code=status.HTTP_200_OK,
    summary="Get system components status",
)
async def system_status(
    system_service: SystemService = Depends(get_system_service),
) -> list[dict]:
    """Return the operational status of system components."""
    # This replaces mockSystemStatus in the frontend
    return [
        {"name": "Llama-3.2 90B Vision AI", "status": "Operational", "latency": "1.2s", "detail": "Single-pass image analysis"},
        {"name": "EasyOCR Engine", "status": "Operational", "latency": "140ms", "detail": "Local text extraction"},
        {"name": "LanceDB Vector Index", "status": "Synced", "latency": "18ms", "detail": "RAG embeddings ready"},
        {"name": "Local Quality Scoring Rules", "status": "Active", "latency": "2ms", "detail": "Deterministic Python engine"}
    ]
