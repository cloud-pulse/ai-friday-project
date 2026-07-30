"""API route registration."""

from fastapi import APIRouter

from api.routes.chat import router as chat_router
from api.routes.inspection import router as inspection_router
from api.routes.reports import router as reports_router
from api.routes.reviews import router as reviews_router
from api.routes.system import router as system_router

api_router = APIRouter()
api_router.include_router(system_router, tags=["System"])
api_router.include_router(inspection_router, tags=["Inspection"])
api_router.include_router(reviews_router, tags=["Human Review"])
api_router.include_router(reports_router, tags=["Reports"])
api_router.include_router(chat_router, tags=["AI Quality Assistant"])

