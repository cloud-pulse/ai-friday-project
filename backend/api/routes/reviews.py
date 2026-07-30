"""Inspector review API."""

from uuid import UUID

from fastapi import APIRouter, Depends, status

from api.dependencies import get_review_service
from schemas.reviews import InspectorReviewCreate, InspectorReviewResponse
from services.review_service import ReviewService

router = APIRouter(prefix="/batches/{batch_id}/review")


@router.post("", response_model=InspectorReviewResponse, status_code=status.HTTP_201_CREATED, summary="Record inspector review")
def create_review(
    batch_id: UUID,
    payload: InspectorReviewCreate,
    review_service: ReviewService = Depends(get_review_service),
) -> InspectorReviewResponse:
    """Record human notes, root cause, corrective actions, and final decision."""
    return review_service.create_review(batch_id, payload)
