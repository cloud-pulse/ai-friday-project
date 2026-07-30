"""Context builder for token-optimized RAG prompt injection."""

from models.inspection import EmbeddingSearchHit


class ContextBuilder:
    """Formats top-K retrieved vector search hits into a structured grounded context string."""

    @staticmethod
    def build(hits: list[EmbeddingSearchHit]) -> str:
        """Converts search hits into concise, structured context for the LLM prompt."""
        if not hits:
            return "No relevant inspection records found in the database."

        context_blocks: list[str] = []
        for idx, hit in enumerate(hits, 1):
            block = (
                f"[{idx}] Source: {hit.source_type} (Batch: {hit.batch_id}, ID: {hit.source_id})\n"
                f"Content: {hit.content.strip()}"
            )
            context_blocks.append(block)

        return "\n\n".join(context_blocks)
