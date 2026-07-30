"""RAG Prompt Builder for the AI Quality Assistant."""

from typing import Any


class RAGPromptBuilder:
    """Constructs token-optimized prompt payloads for azure_ai/genailab-maas-Llama-3.3-70B-Instruct."""

    SYSTEM_PROMPT = (
        "You are the PharmaInspect AI Quality Assistant, a Senior Pharmaceutical Packaging Quality Assurance Expert.\n"
        "Your role is to assist quality inspectors and supervisors in reviewing packaging inspection records, defect trends, "
        "batch quality scores, and compliance status.\n\n"
        "CRITICAL RULES:\n"
        "1. Base your answer strictly on the RETRIEVED INSPECTION RECORDS provided in the context below.\n"
        "2. Do NOT use outside memory or invent packaging facts, batch IDs, or defect statistics not present in the data.\n"
        "3. If the retrieved context does not contain enough information to answer fully, state what data is available and what is missing.\n"
        "4. Be concise, precise, and professional. Use pharmaceutical QA terminology."
    )

    @classmethod
    def build(
        cls,
        user_question: str,
        grounded_context: str,
        conversation_summary: str | None = None,
    ) -> list[dict[str, Any]]:
        """Constructs the chat completions messages payload."""
        messages: list[dict[str, Any]] = [
            {"role": "system", "content": cls.SYSTEM_PROMPT}
        ]

        # Combine conversation summary, retrieved inspection context, and user question
        context_section = f"--- RETRIEVED INSPECTION RECORDS ---\n{grounded_context}\n-----------------------------------"
        
        user_content_parts: list[str] = []
        if conversation_summary and conversation_summary.strip():
            user_content_parts.append(f"PAST CONVERSATION SUMMARY:\n{conversation_summary.strip()}")
            
        user_content_parts.append(context_section)
        user_content_parts.append(f"INSPECTOR QUESTION:\n{user_question.strip()}")

        full_user_content = "\n\n".join(user_content_parts)
        messages.append({"role": "user", "content": full_user_content})

        return messages
