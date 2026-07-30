"""Conversation summarizer for token-efficient chat history management."""

import json

import httpx

from config.settings import settings
from utils.logging import get_logger

logger = get_logger(__name__)


class ConversationSummarizer:
    """Updates running conversation summary to maintain minimal token footprint."""

    def __init__(self) -> None:
        self._base_url = settings.vision_base_url.rstrip("/")
        self._api_path = settings.vision_api_path
        self._model = settings.chat_model
        self._api_key = settings.vision_api_key

    def update_summary(
        self,
        current_summary: str,
        user_message: str,
        assistant_response: str,
    ) -> str:
        """Generates an updated concise conversation summary combining prior summary and recent QA turn."""
        if not self._api_key:
            # Fallback to local rolling summary if API key is not configured
            return self._local_summarize(current_summary, user_message, assistant_response)

        instruction = (
            "Summarize the ongoing conversation between a pharmaceutical quality inspector and an AI Quality Assistant. "
            "Keep the summary extremely concise (max 3-4 sentences), preserving key questions, defect topics, batch IDs, "
            "and conclusions.\n\n"
            f"Prior Summary: {current_summary or 'None'}\n"
            f"Latest User Question: {user_message}\n"
            f"Latest Assistant Answer: {assistant_response}\n\n"
            "Return ONLY the updated summary text without preamble."
        )

        payload = {
            "model": self._model,
            "messages": [
                {"role": "system", "content": "You produce factual, ultra-concise conversation summaries."},
                {"role": "user", "content": instruction},
            ],
            "temperature": 0,
            "max_tokens": 150,
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
            updated = body["choices"][0]["message"]["content"].strip()
            return updated
        except Exception as exc:
            logger.warning("LLM summarization failed, falling back to local summary: %s", exc)
            return self._local_summarize(current_summary, user_message, assistant_response)

    def _local_summarize(self, current_summary: str, user_message: str, assistant_response: str) -> str:
        """Deterministic fallback for local conversation summarization."""
        turn = f"Q: {user_message[:100]}... -> A: {assistant_response[:100]}..."
        if not current_summary:
            return f"Inspector asked: {user_message[:150]}"
        parts = [current_summary.strip(), turn]
        # Keep only last 3 items
        return " | ".join(parts[-3:])
