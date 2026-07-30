"""Dashboard API endpoints."""

from fastapi import APIRouter, Depends
from starlette.concurrency import run_in_threadpool

from api.dependencies import get_dashboard_service
from schemas.dashboard import DashboardDefects, DashboardMetrics, DashboardTrends
from services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard")


@router.get("/metrics", response_model=DashboardMetrics, summary="Get high level dashboard metrics")
async def get_metrics(dashboard_service: DashboardService = Depends(get_dashboard_service)) -> DashboardMetrics:
    return await run_in_threadpool(dashboard_service.get_metrics)


@router.get("/trends", response_model=DashboardTrends, summary="Get dashboard inspection trends")
async def get_trends(dashboard_service: DashboardService = Depends(get_dashboard_service)) -> DashboardTrends:
    return await run_in_threadpool(dashboard_service.get_trends)


@router.get("/defects", response_model=DashboardDefects, summary="Get dashboard defect breakdown")
async def get_defects(dashboard_service: DashboardService = Depends(get_dashboard_service)) -> DashboardDefects:
    return await run_in_threadpool(dashboard_service.get_defects)
