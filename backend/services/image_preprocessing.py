"""OpenCV and Pillow image preparation for OCR and vision inspection."""

from dataclasses import dataclass
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

from utils.exceptions import ApplicationError


@dataclass(frozen=True, slots=True)
class PreprocessedImage:
    image: np.ndarray
    jpeg_bytes: bytes
    width: int
    height: int
    original_width: int
    original_height: int


class ImagePreprocessor:
    """Normalizes image orientation, size, and contrast before inspection."""

    def preprocess(self, path: Path) -> PreprocessedImage:
        try:
            with Image.open(path) as source:
                normalized = source.convert("RGB")
                original_width, original_height = normalized.size
                rgb = np.asarray(normalized)
        except (OSError, ValueError) as exc:
            raise ApplicationError("The uploaded file is not a readable image.", code="invalid_image") from exc

        image = cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)
        image = self._resize(image)
        image = self._improve_contrast(image)
        ok, encoded = cv2.imencode(".jpg", image, [cv2.IMWRITE_JPEG_QUALITY, 92])
        if not ok:
            raise ApplicationError("Unable to encode the preprocessed image.", code="image_preprocessing_failed")
        height, width = image.shape[:2]
        return PreprocessedImage(
            image=image,
            jpeg_bytes=encoded.tobytes(),
            width=width,
            height=height,
            original_width=original_width,
            original_height=original_height,
        )

    @staticmethod
    def _resize(image: np.ndarray, maximum_dimension: int = 2_048) -> np.ndarray:
        height, width = image.shape[:2]
        scale = min(1.0, maximum_dimension / max(height, width))
        if scale == 1.0:
            return image
        return cv2.resize(image, (round(width * scale), round(height * scale)), interpolation=cv2.INTER_AREA)

    @staticmethod
    def _improve_contrast(image: np.ndarray) -> np.ndarray:
        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
        lightness, a_channel, b_channel = cv2.split(lab)
        enhanced = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8)).apply(lightness)
        return cv2.cvtColor(cv2.merge((enhanced, a_channel, b_channel)), cv2.COLOR_LAB2BGR)
