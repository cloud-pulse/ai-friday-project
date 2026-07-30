"""Business logic for application metadata and readiness."""

from config.settings import settings
from schemas.responses import HealthResponse, VersionResponse


class SystemService:
    """Provides status data independently from HTTP concerns."""

    def health(self) -> HealthResponse:
        return HealthResponse(status="healthy", environment=settings.environment)

    def version(self) -> VersionResponse:
        return VersionResponse(
            name=settings.app_name,
            version=settings.app_version,
            api_prefix=settings.api_v1_prefix,
        )
