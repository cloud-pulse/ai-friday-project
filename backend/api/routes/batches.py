"""Batch CRUD and summaries API endpoints."""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from starlette.concurrency import run_in_threadpool

from api.dependencies import get_batch_service
from schemas.batches import BatchCreate, BatchResponse, BatchSummaryResponse
from services.batch_service import BatchService

router = APIRouter(prefix="/batches")


@router.post(
    "",
    response_model=BatchResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new inspection batch",
)
async def create_batch(
    payload: BatchCreate,
    batch_service: BatchService = Depends(get_batch_service),
) -> BatchResponse:
    return await run_in_threadpool(batch_service.create_batch, payload)


@router.get(
    "",
    response_model=list[BatchResponse],
    status_code=status.HTTP_200_OK,
    summary="List all batches",
)
async def list_batches(
    batch_service: BatchService = Depends(get_batch_service),
) -> list[BatchResponse]:
    return await run_in_threadpool(batch_service.list_batches)


@router.get(
    "/{batch_id}",
    response_model=BatchResponse,
    status_code=status.HTTP_200_OK,
    summary="Get a specific batch",
)
async def get_batch(
    batch_id: UUID,
    batch_service: BatchService = Depends(get_batch_service),
) -> BatchResponse:
    batch = await run_in_threadpool(batch_service.get_batch, batch_id)
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    return batch


@router.get(
    "/{batch_id}/summary",
    response_model=BatchSummaryResponse,
    status_code=status.HTTP_200_OK,
    summary="Get batch inspection summary",
)
async def get_batch_summary(
    batch_id: UUID,
    batch_service: BatchService = Depends(get_batch_service),
) -> BatchSummaryResponse:
    summary = await run_in_threadpool(batch_service.get_batch_summary, batch_id)
    if not summary:
        raise HTTPException(status_code=404, detail="Batch not found")
    return summary

@router.get(
    "/{batch_id}/results",
    status_code=status.HTTP_200_OK,
    summary="Get batch inspection results",
)
async def get_batch_results(
    batch_id: UUID,
    batch_service: BatchService = Depends(get_batch_service),
) -> list[dict]:
    return await run_in_threadpool(batch_service.get_batch_results, batch_id)

