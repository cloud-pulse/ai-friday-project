# Hackathon Presentation Notes: Backend Architecture

Use these notes to confidently explain how the backend of PharmaInspect AI works during your hackathon pitch.

## 1. The Core Innovation: "Analyze Once, Reuse Everywhere"
> [!TIP]
> **Pitch Talking Point:** "The biggest problem with typical AI agents is that they consume massive amounts of tokens by repeatedly analyzing the same data. We solved this by creating a highly optimized, linear pipeline."

*   **The Old Way:** AI is queried repeatedly to look at an image, calculate a score, write a report, and answer chat questions. This is slow and expensive.
*   **Our Way:** The Vision AI model looks at the image exactly **once**. It generates a strict, highly structured JSON output. From that point on, all other downstream tasks (scoring, dashboards, reporting, RAG chat) just read that JSON. We drastically cut down latency and API costs.

## 2. The Step-by-Step Backend Pipeline

When an image is uploaded, here is exactly what our FastAPI backend does:

### Step 1: Image Preprocessing (OpenCV)
*   **What happens:** We don't just blindly send user photos to the AI. We use **OpenCV** to resize the image (preventing massive uploads from breaking the AI context limit) and apply CLAHE (Contrast Limited Adaptive Histogram Equalization).
*   **Why it matters:** It standardizes the input so the AI can easily spot subtle packaging defects, even if the factory lighting was poor.

### Step 2: Optical Character Recognition (EasyOCR)
*   **What happens:** We use **EasyOCR** to extract text locally (like lot numbers and expiration dates) before calling the AI.
*   **Why it matters:** We feed this text to the Vision model as "supporting evidence." This prevents the Vision AI from hallucinating text on blurry labels.

### Step 3: The Single Vision AI Call
*   **What happens:** We send the cleaned image and OCR text to **Llama-3.2-90B-Vision-Instruct**. We use a strict system prompt demanding a JSON object.
*   **Why it matters:** The AI acts strictly as an inspector. It identifies defects, assesses seal integrity, and scores confidence, returning data in a structured format our backend can read programmatically.

### Step 4: Local Quality Scoring (Python)
*   **What happens:** Instead of asking the AI "did this pass or fail?", we use deterministic Python logic (`QualityScoreService`).
*   **Why it matters:** AI can be unpredictable. By using standard code to calculate the final pass/fail score based on the AI's JSON findings, we guarantee consistency and compliance with QA standards.

### Step 5: Vector Storage (LanceDB)
*   **What happens:** The image, the structured JSON, and text embeddings (via **text-embedding-3-large**) are saved locally using **LanceDB**. 
*   **Why it matters:** LanceDB runs embedded in our backend without needing external cloud infrastructure, making the app extremely fast and fully self-contained. 

## 3. Human-in-the-Loop & Final Reporting

> [!IMPORTANT]
> **Pitch Talking Point:** "AI shouldn't replace QA inspectors; it should give them superpowers."

*   **The Review:** The system flags batches as `READY_FOR_REVIEW`. A human inspector looks at the AI's findings via the React dashboard and can add notes, correct false positives, or suggest root causes.
*   **The Draft Report:** We send the *aggregated JSON* + *Human Notes* to **GPT-4o** to generate a polished, professional PDF report. 
*   **The Chat (RAG):** If a user wants to ask questions about past inspections, we use **Llama-3.3-70B-Instruct** with Retrieval-Augmented Generation (RAG). LanceDB retrieves only the top-K relevant records, keeping token costs near zero while providing instant answers.

## 4. The Tech Stack Summary
*   **API:** FastAPI (Python 3.12+)
*   **Computer Vision:** OpenCV + EasyOCR
*   **Database:** LanceDB (Local Vector DB)
*   **Vision Model:** Llama-3.2-90B-Vision-Instruct
*   **LLMs:** GPT-4o (Reporting) & Llama-3.3-70B-Instruct (Chat)
