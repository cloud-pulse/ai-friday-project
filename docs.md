# AI-Assisted Visual Inspection Tool - Documentation

This document explains the core functioning of the visual inspection system, detailing the image processing pipeline, AI recognition mechanisms, and model requirements.

## 1. How the Project Functions

The project is an end-to-end web-based application designed for the visual inspection of pharmaceutical packaging. The core workflow is as follows:

1. **Upload:** A user uploads one or more images of a manufactured product (e.g., pharmaceutical packaging) via the frontend interface.
2. **Preprocessing:** The backend receives the images and passes them through an `ImagePreprocessor` (using OpenCV and Pillow). This step normalizes the image by resizing it (capping dimensions to 2048 pixels) and improving contrast using CLAHE (Contrast Limited Adaptive Histogram Equalization).
3. **OCR Extraction:** An Optical Character Recognition (OCR) service (using EasyOCR) scans the preprocessed image to extract any visible text (like labels, lot numbers, or expiry dates).
4. **AI Vision Inspection:** The preprocessed image bytes and the extracted OCR data are sent to a generative AI Vision Model.
5. **Quality Scoring & Persistence:** The AI returns a structured JSON response identifying defects. A `QualityScoreService` then evaluates this response to determine a final decision (`passed`, `failed`, or `needs_review`). All data, including the image and results, are persisted using a LanceDB vector database.

## 2. What Happens When You Upload a Few Images?

When you upload multiple images, the system processes them as a **Batch**.
- A unique `batch_id` is assigned to your upload session.
- Each image is individually saved to local storage in an `uploads/` directory structured by its batch ID.
- Each image independently goes through the preprocessing, OCR, and AI inspection pipeline.
- Once all images in the batch are processed, the batch status is updated to `READY_FOR_REVIEW`, allowing the inspector to view a consolidated report or dashboard of the results on the frontend.

## 3. How the AI Identifies and Recognizes Damaged/Bad Images

The system does not rely on a traditional rigidly trained CNN (like YOLO or ResNet). Instead, it uses a **Large Multimodal Model (LMM)** with zero-shot prompting techniques. 

Here is how the recognition works:
- **System Prompting:** The AI is given a strict persona: *"You are a pharmaceutical packaging inspector."*
- **Multimodal Input:** The AI receives the image directly along with the OCR results as "supporting evidence." It is strictly instructed not to hallucinate text that isn't visible.
- **Structured Output:** The AI is forced to return a highly structured JSON object (using JSON mode). It evaluates specific criteria such as:
  - `packaging_status`: passed, failed, or needs review.
  - `seal_integrity`: intact, damaged, or uncertain.
  - `label_verified`: a boolean flag.
  - `defects`: A list of recognized issues, categorized by description, severity (low, medium, high, critical), and a confidence score.
- **Reasoning:** The model uses its vast pre-trained knowledge of what normal vs. damaged physical objects look like to detect anomalies like tears, dents, misaligned labels, or broken seals based on the prompt instructions.

## 4. What Model is Required?

The application is built to be model-agnostic but requires a **Vision-capable Generative AI model** that supports the OpenAI Chat Completions API format. 

Specifically, the model must support:
- **Image Inputs** (`image_url` with base64 data URIs).
- **Structured JSON Output** (`response_format: { "type": "json_object" }`).

**Recommended Models:**
- OpenAI GPT-4o or GPT-4 Turbo with Vision
- Anthropic Claude 3.5 Sonnet (via an OpenAI-compatible proxy)
- Open-source Vision models (e.g., LLaVA, Qwen-VL) hosted on an OpenAI-compatible inference server like vLLM or Ollama.

The specific model, API key, and base URL are configurable via environment variables (`VISION_MODEL`, `VISION_API_KEY`, `VISION_BASE_URL`). If the API fails, the system is designed to gracefully fall back to a mock inspection result.
