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
