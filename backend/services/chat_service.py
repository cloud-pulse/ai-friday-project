"""RAG AI Quality Assistant chat service orchestrating embedding search, prompt building, LLM execution, and session management."""

from uuid import UUID, uuid4

import httpx

from config.settings import settings
from database.lancedb.repositories import (
    ChatMessageRepository,
    ChatSessionRepository,
    EmbeddingRepository,
)
from models.chat import ChatMessage, ChatRole, ChatSession
from schemas.chat import ChatCitation, ChatRequest, ChatResponse
from services.embedding_service import EmbeddingService
from services.rag.context_builder import ContextBuilder
from services.rag.prompt_builder import RAGPromptBuilder
from services.rag.summarizer import ConversationSummarizer
from utils.exceptions import ApplicationError
from utils.logging import get_logger

logger = get_logger(__name__)


class ChatService:
    """Orchestrates RAG workflow for inspection questions using LanceDB vector search and Llama-3.3-70B-Instruct."""

    def __init__(
        self,
        session_repository: ChatSessionRepository,
        message_repository: ChatMessageRepository,
        embedding_repository: EmbeddingRepository,
        embedding_service: EmbeddingService,
        summarizer: ConversationSummarizer | None = None,
    ) -> None:
        self._sessions = session_repository
        self._messages = message_repository
        self._embeddings = embedding_repository
        self._embedding_service = embedding_service
        self._summarizer = summarizer or ConversationSummarizer()
        self._base_url = settings.vision_base_url.rstrip("/")
        self._api_path = settings.vision_api_path
        self._chat_model = settings.chat_model
        self._api_key = settings.vision_api_key

    def ask(self, request: ChatRequest) -> ChatResponse:
        """Executes the RAG flow to answer inspection-related questions."""
        if not request.message or not request.message.strip():
            raise ApplicationError("Chat message cannot be empty.", code="empty_chat_message")

        # 1. Retrieve or create session
        session = self._get_or_create_session(request.session_id, request.batch_id)

        # 2. Generate embedding for user question
        query_vector = self._embedding_service.generate_embedding(request.message)

        # 3. Vector search Top-K relevant records from LanceDB
        top_k = request.top_k or settings.rag_top_k
        hits = self._embeddings.search(query_vector, limit=top_k, batch_id=request.batch_id)

        # 4. Build grounded context
        grounded_context = ContextBuilder.build(hits)

        # 5. Construct LLM prompt payload
        messages_payload = RAGPromptBuilder.build(
            user_question=request.message,
            grounded_context=grounded_context,
            conversation_summary=session.summary,
        )

        # 6. Call Llama 3.3 70B Instruct chat completions endpoint
        assistant_content = self._call_llm(messages_payload)

        # 7. Update conversation summary
        updated_summary = self._summarizer.update_summary(
            current_summary=session.summary,
            user_message=request.message,
            assistant_response=assistant_content,
        )

        # 8. Persist messages & updated session state
        user_msg = ChatMessage(session_id=session.id, role=ChatRole.USER, content=request.message)
        assistant_msg = ChatMessage(session_id=session.id, role=ChatRole.ASSISTANT, content=assistant_content)

        self._messages.create(user_msg)
        self._messages.create(assistant_msg)
        self._sessions.update(session.id, summary=updated_summary)

        # 9. Format source citations
        citations = [
            ChatCitation(
                source_type=hit.source_type,
                source_id=hit.source_id,
                batch_id=hit.batch_id,
                content=hit.content,
                distance=hit.distance,
            )
            for hit in hits
        ]

        return ChatResponse(
            session_id=session.id,
            message=assistant_content,
            retrieved_sources=citations,
            summary=updated_summary,
        )

    def list_sessions(self, limit: int = 50) -> list[ChatSession]:
        """Lists recent chat sessions."""
        return self._sessions.list_recent(limit=limit)

    def get_session_history(self, session_id: UUID) -> tuple[ChatSession, list[ChatMessage]]:
        """Retrieves session details and message history."""
        session = self._sessions.get(session_id)
        if session is None:
            raise ApplicationError("Chat session not found.", code="session_not_found", status_code=404)
        messages = self._messages.list_by_session(session_id)
        return session, messages

    def delete_session(self, session_id: UUID) -> None:
        """Deletes a chat session and its messages."""
        session = self._sessions.get(session_id)
        if session is None:
            raise ApplicationError("Chat session not found.", code="session_not_found", status_code=404)
        self._sessions.delete(session_id)

    def _get_or_create_session(self, session_id: UUID | None, batch_id: UUID | None) -> ChatSession:
        if session_id is not None:
            existing = self._sessions.get(session_id)
            if existing is not None:
                return existing

        # Create new session
        session = ChatSession(
            id=session_id or uuid4(),
            batch_id=batch_id,
            title="Inspection Quality Q&A",
            summary="",
        )
        return self._sessions.create(session)

    def _call_llm(self, messages: list[dict]) -> str:
        if not self._api_key:
            raise ApplicationError("VISION_API_KEY is not configured.", code="chat_not_configured", status_code=503)

        payload = {
            "model": self._chat_model,
            "messages": messages,
            "temperature": 0.2,
        }
        headers = {
            "Authorization": f"Bearer {self._api_key}",
            "Content-Type": "application/json",
        }

        try:
            with httpx.Client(verify=settings.ai_verify_ssl, timeout=settings.vision_timeout_seconds) as client:
                response = client.post(f"{self._base_url}{self._api_path}", headers=headers, json=payload)
                response.raise_for_status()
                body = response.json()
            return body["choices"][0]["message"]["content"].strip()
        except (httpx.HTTPError, KeyError, IndexError, ValueError) as exc:
            logger.error("Chat model execution failed: %s", exc)
            raise ApplicationError("AI Quality Assistant request failed.", code="chat_request_failed", status_code=502) from exc
