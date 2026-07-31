from __future__ import annotations

import io
import math
from dataclasses import dataclass
from pathlib import Path
from uuid import uuid4

from PIL import Image, ImageFilter, ImageOps, UnidentifiedImageError

from app.domain.models import InspectionResult


SUPPORTED_IMAGE_TYPES = {".jpg", ".jpeg", ".png", ".webp"}


@dataclass(frozen=True, slots=True)
class ReferenceMatch:
    image_name: str
    similarity: float
    color_similarity: float
    structure_similarity: float
    edge_similarity: float


@dataclass(frozen=True, slots=True)
class VisualEmbedding:
    combined: tuple[float, ...]
    color: tuple[float, ...]
    structure: tuple[float, ...]
    edges: tuple[float, ...]


class ImageVectorizer:
    """Create a normalized visual embedding without external model services."""

    def embed_bytes(self, image_bytes: bytes) -> VisualEmbedding:
        with Image.open(io.BytesIO(image_bytes)) as image:
            return self._embed(image)

    def embed_file(self, image_path: Path) -> VisualEmbedding:
        with Image.open(image_path) as image:
            return self._embed(image)

    def _embed(self, source: Image.Image) -> VisualEmbedding:
        image = ImageOps.fit(
            source.convert("RGB"),
            (64, 64),
            method=Image.Resampling.LANCZOS,
        )

        # Color distribution captures label/packaging color changes.
        histogram = image.histogram()
        color: list[float] = []
        for channel in range(3):
            values = histogram[channel * 256 : (channel + 1) * 256]
            color.extend(sum(values[index : index + 16]) / 4096 for index in range(0, 256, 16))

        # Low-resolution luminance retains package position and overall structure.
        luminance_image = image.convert("L").resize((16, 16), Image.Resampling.LANCZOS)
        luminance = [value / 255 for value in luminance_image.getdata()]
        mean_luminance = sum(luminance) / len(luminance)
        structure = [value - mean_luminance for value in luminance]

        # Edge energy highlights broken boundaries and structural anomalies.
        edge_image = (
            image.convert("L")
            .filter(ImageFilter.FIND_EDGES)
            .resize((16, 16), Image.Resampling.LANCZOS)
        )
        edges = [value / 255 for value in edge_image.getdata()]

        normalized_color = tuple(self._normalize(color))
        normalized_structure = tuple(self._normalize(structure))
        normalized_edges = tuple(self._normalize(edges))
        vector = (
            [value * 0.35 for value in normalized_color]
            + [value * 0.40 for value in normalized_structure]
            + [value * 0.25 for value in normalized_edges]
        )
        return VisualEmbedding(
            combined=tuple(self._normalize(vector)),
            color=normalized_color,
            structure=normalized_structure,
            edges=normalized_edges,
        )

    @staticmethod
    def _normalize(values: list[float]) -> list[float]:
        magnitude = math.sqrt(sum(value * value for value in values)) or 1.0
        return [value / magnitude for value in values]


class GoodImageVectorStore:
    """In-memory vector index containing approved good-image references."""

    def __init__(self, reference_dir: Path, vectorizer: ImageVectorizer | None = None) -> None:
        self.reference_dir: Path | None = reference_dir
        self.vectorizer = vectorizer or ImageVectorizer()
        self._vectors: list[tuple[str, VisualEmbedding]] = []
        self.reindex()

    @classmethod
    def from_images(
        cls,
        images: dict[str, bytes],
        vectorizer: ImageVectorizer | None = None,
    ) -> "GoodImageVectorStore":
        if not images:
            raise ValueError("At least one reference image is required")
        store = cls.__new__(cls)
        store.reference_dir = None
        store.vectorizer = vectorizer or ImageVectorizer()
        store._vectors = [
            (name, store.vectorizer.embed_bytes(content))
            for name, content in sorted(images.items())
        ]
        return store

    @property
    def size(self) -> int:
        return len(self._vectors)

    def reindex(self) -> None:
        if self.reference_dir is None:
            raise ValueError("An in-memory vector store cannot be reindexed from disk")
        self._vectors = [
            (path.name, self.vectorizer.embed_file(path))
            for path in sorted(self.reference_dir.iterdir())
            if path.is_file() and path.suffix.casefold() in SUPPORTED_IMAGE_TYPES
        ]
        if not self._vectors:
            raise ValueError(f"No supported reference images found in {self.reference_dir}")

    def retrieve(self, image_bytes: bytes, top_k: int = 3) -> list[ReferenceMatch]:
        query = self.vectorizer.embed_bytes(image_bytes)
        matches = [
            ReferenceMatch(
                image_name=name,
                similarity=self._cosine(query.combined, vector.combined),
                color_similarity=self._cosine(query.color, vector.color),
                structure_similarity=self._cosine(query.structure, vector.structure),
                edge_similarity=self._cosine(query.edges, vector.edges),
            )
            for name, vector in self._vectors
        ]
        return sorted(matches, key=lambda match: match.similarity, reverse=True)[:top_k]

    @staticmethod
    def _cosine(left: tuple[float, ...], right: tuple[float, ...]) -> float:
        return max(0.0, min(1.0, sum(a * b for a, b in zip(left, right))))


class ImageRAGVisionInspector:
    """Inspect images using retrieval against an approved good-image corpus."""

    def __init__(
        self,
        reference_dir: Path | None = None,
        similarity_threshold: float = 0.90,
        relevance_threshold: float = 0.50,
        top_k: int = 3,
        vector_store: GoodImageVectorStore | None = None,
    ) -> None:
        if not 0 < similarity_threshold <= 1:
            raise ValueError("similarity_threshold must be between 0 and 1")
        if not 0 <= relevance_threshold < similarity_threshold:
            raise ValueError(
                "relevance_threshold must be non-negative and lower than similarity_threshold"
            )
        if vector_store is None and reference_dir is None:
            raise ValueError("reference_dir or vector_store is required")
        self.vector_store = vector_store or GoodImageVectorStore(reference_dir)  # type: ignore[arg-type]
        self.similarity_threshold = similarity_threshold
        self.relevance_threshold = relevance_threshold
        self.top_k = top_k

    def inspect(self, image_name: str, image_bytes: bytes) -> InspectionResult:
        try:
            matches = self.vector_store.retrieve(image_bytes, self.top_k)
        except (UnidentifiedImageError, OSError, ValueError):
            return InspectionResult(
                id=str(uuid4()),
                image_name=image_name,
                packaging_integrity=0,
                seal_quality=0,
                label_accuracy=0,
                ocr_verified=False,
                defects=["Invalid or unreadable image"],
                confidence=0.0,
                ai_summary="The uploaded file could not be decoded as a supported image. Human review required.",
                passed=False,
                valid_for_inspection=False,
            )

        closest = matches[0]
        similarity = round(closest.similarity, 4)
        packaging_score = round(similarity * 100)
        seal_score = round(closest.edge_similarity * 100)
        label_score = round(
            ((closest.color_similarity + closest.structure_similarity) / 2) * 100
        )

        if similarity < self.relevance_threshold:
            reason = (
                f"Invalid image — only {similarity:.0%} reference relevance; "
                f"minimum {self.relevance_threshold:.0%} is required for packaging inspection"
            )
            return InspectionResult(
                id=str(uuid4()),
                image_name=image_name,
                packaging_integrity=packaging_score,
                seal_quality=seal_score,
                label_accuracy=label_score,
                ocr_verified=False,
                defects=[reason],
                confidence=similarity,
                ai_summary=(
                    "Rejected before defect assessment because the image does not "
                    "sufficiently resemble the approved pharmaceutical packaging corpus. "
                    "It is excluded from batch quality calculations."
                ),
                passed=False,
                valid_for_inspection=False,
            )

        passed = similarity >= self.similarity_threshold
        defects = [] if passed else self._failure_reasons(closest)
        evidence = ", ".join(
            f"{match.image_name} ({match.similarity:.1%})"
            for match in matches
        )
        if passed:
            summary = (
                f"Consistent with the approved good-image corpus. "
                f"Retrieved references: {evidence}."
            )
        else:
            summary = (
                f"Nearest approved-reference similarity is {similarity:.1%}, below the "
                f"required {self.similarity_threshold:.0%}. Feature comparison: "
                f"color appearance {closest.color_similarity:.1%}, "
                f"package/label structure {closest.structure_similarity:.1%}, and "
                f"seal/edge pattern {closest.edge_similarity:.1%}. "
                f"Retrieved references: {evidence}. Human review required."
            )

        return InspectionResult(
            id=str(uuid4()),
            image_name=image_name,
            packaging_integrity=packaging_score,
            seal_quality=seal_score,
            label_accuracy=label_score,
            ocr_verified=False,
            defects=defects,
            confidence=similarity,
            ai_summary=summary,
            passed=passed,
        )

    def _failure_reasons(self, match: ReferenceMatch) -> list[str]:
        reasons = [
            (
                f"Overall match {match.similarity:.0%} is below the "
                f"{self.similarity_threshold:.0%} approved-reference threshold"
            )
        ]
        if match.structure_similarity < self.similarity_threshold:
            reasons.append(
                f"Package or label layout differs ({match.structure_similarity:.0%} structural match)"
            )
        if match.edge_similarity < self.similarity_threshold:
            reasons.append(
                f"Package/seal edge pattern differs ({match.edge_similarity:.0%} edge match)"
            )
        if match.color_similarity < self.similarity_threshold:
            reasons.append(
                f"Packaging or label color differs ({match.color_similarity:.0%} color match)"
            )
        return reasons
