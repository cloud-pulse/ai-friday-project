"""Human-in-the-loop review workflow."""

from datetime import datetime, timezone
from uuid import UUID

from database.lancedb.repositories import BatchRepository, ReviewRepository
from models.inspection import BatchStatus, InspectorReview, ReviewDecision
from schemas.reviews import InspectorReviewCreate, InspectorReviewResponse
from utils.exceptions import ApplicationError


class ReviewService:
    """Records inspector decisions and transitions the batch review state."""

    def __init__(self, batch_repository: BatchRepository, review_repository: ReviewRepository) -> None:
        self._batches = batch_repository
        self._reviews = review_repository

    def create_review(self, batch_id: UUID, payload: InspectorReviewCreate) -> InspectorReviewResponse:
        if self._batches.get(batch_id) is None:
            raise ApplicationError("Inspection batch was not found.", code="batch_not_found", status_code=404)
        approved_at = datetime.now(timezone.utc) if payload.decision == ReviewDecision.APPROVED else None
        review = self._reviews.create(InspectorReview(batch_id=batch_id, approved_at=approved_at, **payload.model_dump()))
        batch_status = BatchStatus.READY_FOR_REVIEW if payload.decision == ReviewDecision.ON_HOLD else BatchStatus.REVIEWED
        self._batches.update(batch_id, status=batch_status)
        return self._response(review)

    def latest_review(self, batch_id: UUID) -> InspectorReview | None:
        reviews = self._reviews.list_by_batch(batch_id, limit=10_000)
        return max(reviews, key=lambda review: review.created_at) if reviews else None

    @staticmethod
    def _response(review: InspectorReview) -> InspectorReviewResponse:
        approval_status = "approved" if review.decision == ReviewDecision.APPROVED else "rejected" if review.decision == ReviewDecision.REJECTED else "pending"
        return InspectorReviewResponse(
            review=review,
            approval_status=approval_status,
            final_decision=review.decision,
            approved_at=review.approved_at,
        )
