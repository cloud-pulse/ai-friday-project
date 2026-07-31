import io

from PIL import Image

from app.infrastructure.image_rag import GoodImageVectorStore, ImageRAGVisionInspector


def image_bytes(color: tuple[int, int, int]) -> bytes:
    output = io.BytesIO()
    Image.new("RGB", (96, 64), color).save(output, format="PNG")
    return output.getvalue()


def reference_store() -> GoodImageVectorStore:
    return GoodImageVectorStore.from_images(
        {
            "approved-green.png": image_bytes((40, 180, 120)),
            "approved-red.png": image_bytes((210, 45, 45)),
        }
    )


def test_vector_store_retrieves_closest_good_image() -> None:
    store = reference_store()

    matches = store.retrieve(image_bytes((42, 178, 118)), top_k=1)

    assert store.size == 2
    assert matches[0].image_name == "approved-green.png"


def test_inspector_passes_an_approved_reference_with_retrieval_evidence() -> None:
    approved = image_bytes((40, 180, 120))
    inspector = ImageRAGVisionInspector(
        similarity_threshold=0.90,
        vector_store=reference_store(),
    )

    result = inspector.inspect("uploaded.png", approved)

    assert result.passed is True
    assert result.confidence == 1.0
    assert result.defects == []
    assert "approved-green.png (100.0%)" in result.ai_summary


def test_inspector_rejects_an_image_outside_the_good_corpus() -> None:
    store = GoodImageVectorStore.from_images(
        {"approved-green.png": image_bytes((40, 180, 120))}
    )
    inspector = ImageRAGVisionInspector(
        similarity_threshold=0.99,
        relevance_threshold=0.0,
        vector_store=store,
    )

    result = inspector.inspect("different.png", image_bytes((210, 45, 45)))

    assert result.passed is False
    assert "below the 99% approved-reference threshold" in result.defects[0]
    assert any("differs" in reason for reason in result.defects[1:])
    assert "Feature comparison:" in result.ai_summary
    assert "Human review required" in result.ai_summary


def test_inspector_invalidates_an_out_of_domain_image() -> None:
    store = GoodImageVectorStore.from_images(
        {"approved-green.png": image_bytes((40, 180, 120))}
    )
    inspector = ImageRAGVisionInspector(
        similarity_threshold=1.0,
        relevance_threshold=0.99,
        vector_store=store,
    )

    result = inspector.inspect("random-screenshot.png", image_bytes((210, 45, 45)))

    assert result.valid_for_inspection is False
    assert result.passed is False
    assert "Invalid image" in result.defects[0]
    assert "excluded from batch quality calculations" in result.ai_summary


def test_inspector_rejects_unreadable_files() -> None:
    inspector = ImageRAGVisionInspector(vector_store=reference_store())

    result = inspector.inspect("not-an-image.txt", b"not an image")

    assert result.passed is False
    assert result.valid_for_inspection is False
    assert result.confidence == 0.0
    assert result.defects == ["Invalid or unreadable image"]
