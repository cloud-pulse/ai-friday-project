"""AI Quality Assistant RAG Chat REST API Endpoints."""

from uuid import UUID

from fastapi import APIRouter, Depends, status
from starlette.concurrency import run_in_threadpool

from api.dependencies import get_chat_service
from schemas.chat import ChatMessageResponse, ChatRequest, ChatResponse, ChatSessionResponse
from services.chat_service import ChatService

router = APIRouter(prefix="/chat")


@router.post(
    "",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Ask the AI Quality Assistant a question",
)
async def ask_assistant(
    request: ChatRequest,
    chat_service: ChatService = Depends(get_chat_service),
) -> ChatResponse:
    """Executes RAG flow: generates embedding, searches Top-K inspection records in LanceDB, builds prompt, calls LLM, and updates conversation summary."""
    return await run_in_threadpool(chat_service.ask, request)


@router.get(
    "/sessions",
    response_model=list[ChatSessionResponse],
    summary="List recent chat sessions",
)
async def list_sessions(
    chat_service: ChatService = Depends(get_chat_service),
) -> list[ChatSessionResponse]:
    """Retrieves all recent chat sessions."""
    sessions = await run_in_threadpool(chat_service.list_sessions)
    return [
        ChatSessionResponse(
            id=s.id,
            batch_id=s.batch_id,
            title=s.title,
            summary=s.summary,
            created_at=s.created_at,
            updated_at=s.updated_at,
        )
        for s in sessions
    ]


@router.get(
    "/sessions/{session_id}",
    response_model=ChatSessionResponse,
    summary="Get chat session details and message history",
)
async def get_session(
    session_id: UUID,
    chat_service: ChatService = Depends(get_chat_service),
) -> ChatSessionResponse:
    """Retrieves session details and full turn history for a chat session."""
    session, messages = await run_in_threadpool(chat_service.get_session_history, session_id)
    return ChatSessionResponse(
        id=session.id,
        batch_id=session.batch_id,
        title=session.title,
        summary=session.summary,
        created_at=session.created_at,
        updated_at=session.updated_at,
        messages=[
            ChatMessageResponse(
                id=m.id,
                session_id=m.session_id,
                role=m.role,
                content=m.content,
                created_at=m.created_at,
            )
            for m in messages
        ],
    )


@router.delete(
    "/sessions/{session_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a chat session",
)
async def delete_session(
    session_id: UUID,
    chat_service: ChatService = Depends(get_chat_service),
) -> None:
    """Deletes a chat session."""
    await run_in_threadpool(chat_service.delete_session, session_id)
