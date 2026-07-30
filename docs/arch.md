I think this is the right time to optimize the architecture. Looking at your current architecture, the biggest source of token consumption is that **AI is involved too many times in the pipeline**—inspection, reporting, and chat all consume large contexts. 

For a hackathon, I'd redesign it around a simple principle:

> **AI analyzes once → Store structured results → Reuse those results everywhere.**

That keeps costs low, improves response times, and simplifies the system.

---

# PharmaInspect AI (Optimized Architecture)

## High-Level Architecture

```text
                                    PharmaInspect AI
                AI-Powered Pharmaceutical Packaging Inspection Platform

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   React Frontend                                            │
│---------------------------------------------------------------------------------------------│
│ • Landing Page                                                                              │
│ • Dashboard                                                                                 │
│ • Create Inspection Batch                                                                   │
│ • Image Upload                                                                              │
│ • Inspection Summary                                                                        │
│ • Human Review                                                                              │
│ • Reports                                                                                   │
│ • AI Quality Assistant                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
                                           │
                                 React Router + Axios
                                           │
                                   FastAPI REST API
                                           │
      ┌───────────────────────────────┬──────────────────────────────┬─────────────────────────┐
      │                               │                              │
      │                               │                              │
 Batch Management              Inspection Engine                AI Chat Service
      │                               │                              │
      │                        OpenCV + Pillow                      │
      │                               │                              │
      │                          EasyOCR                            │
      │                               │                              │
      │                   Vision AI (Single Call)                   │
      │        Llama-3.2-90B-Vision-Instruct                        │
      │                               │                              │
      └───────────────────────────────┴──────────────────────────────┘
                                      │
                         Structured Inspection JSON
      (Defects + OCR + Confidence + Summary + Metadata + Quality Signals)
                                      │
                     Local Quality Score Calculation (Python)
                                      │
                                      ▼
                               LanceDB Database
                                      │
      ┌──────────────────────┬────────────────────────────┬───────────────────────┐
      │                      │                            │
 Metadata              Vector Embeddings            Inspection History
 OCR Results           AI Summary                  Reports
 Defects               Recommendations             Batch Metadata
 Quality Scores        Semantic Search             Human Notes
                                      │
                                      ▼
                         Human Review & Validation
                         (Inspector Comments/Edit)
                                      │
                                      ▼
                         AI Draft Report Generator
                 GPT-4o + Aggregated JSON + Human Notes
                                      │
                                      ▼
                             Final PDF Report
                                      │
                                      ▼
                             AI Chat Assistant
         Llama-3.3-70B + RAG (Top-K Results from LanceDB)
```

---

# Optimized AI Pipeline

```text
Upload Images

        │

        ▼

OpenCV
(Image Cleanup)

        │

        ▼

EasyOCR
(Local OCR)

        │

        ▼

Vision AI
(ONE AI CALL)

        │

        ▼

Structured JSON

{
  Packaging Status
  OCR Verification
  Defects
  Confidence
  AI Summary
}

        │

        ▼

Local Quality Score
(Python Rules)

        │

        ▼

Store JSON + Embedding

        │

        ▼

Human Review

        │

        ▼

Generate Final Report

        │

        ▼

Chat via RAG
```

---

# Human-in-the-Loop Reporting

```text
AI Inspection

        │

        ▼

Inspection Summary

        │

        ▼

Inspector Review

        │
        ├── Add Notes
        ├── Correct Findings
        ├── Add Root Cause
        ├── Add Corrective Action
        └── Final Decision

        │

        ▼

GPT-4o Draft Report

        │

        ▼

Final PDF Report
```

### Final report includes

```text
AI Findings

+

Inspector Comments

+

Corrective Actions

+

Final Recommendation

+

Approval Status
```

This is much closer to a real pharmaceutical QA workflow.

---

# Token-Optimized AI Strategy

| Feature         | Previous                | Optimized                           |
| --------------- | ----------------------- | ----------------------------------- |
| Vision Analysis | Reused multiple times   | ✅ Single AI call per analyzed image |
| OCR             | Sent repeatedly         | ✅ Stored once                       |
| Quality Score   | AI                      | ✅ Local Python logic                |
| Statistics      | AI                      | ✅ Local aggregation                 |
| Charts          | AI                      | ✅ React only                        |
| Report          | Full inspection history | ✅ Aggregated JSON + Human Notes     |
| Chat            | Entire database         | ✅ Top-K RAG retrieval only          |

---

# Updated Layered Architecture

```text
Presentation Layer

React
Tailwind
Recharts

↓

API Layer

FastAPI

↓

Business Layer

Batch Service

Inspection Engine

Quality Score Engine

Human Review Service

Report Service

AI Chat Service

↓

AI Layer

Vision AI

Embedding Service

RAG Service

↓

Data Layer

LanceDB

Uploads

Reports
```

---

# Updated Technology Stack

## Frontend

| Technology     | Purpose             |
| -------------- | ------------------- |
| React.js       | UI Framework        |
| Tailwind CSS   | Styling             |
| React Router   | Routing             |
| Axios          | API Communication   |
| React Dropzone | Folder Upload       |
| Recharts       | Analytics Dashboard |

---

## Backend

| Technology   | Purpose     |
| ------------ | ----------- |
| FastAPI      | REST API    |
| Python 3.12+ | Backend     |
| Pydantic     | Validation  |
| Uvicorn      | ASGI Server |

---

## Computer Vision

| Technology | Purpose             |
| ---------- | ------------------- |
| OpenCV     | Image preprocessing |
| Pillow     | Image utilities     |
| EasyOCR    | OCR extraction      |

---

## AI Models

| Model                                                    | Purpose                                       | Token Strategy                               |
| -------------------------------------------------------- | --------------------------------------------- | -------------------------------------------- |
| **azure_ai/genailab-maas-Llama-3.2-90B-Vision-Instruct** | Image inspection & structured JSON generation | **One call per analyzed image**              |
| **azure/genailab-maas-text-embedding-3-large**           | LanceDB embeddings                            | Only for summaries/final JSON                |
| **azure_ai/genailab-maas-Llama-3.3-70B-Instruct**        | RAG Quality Assistant                         | Uses only Top-K retrieved context            |
| **azure/genailab-maas-gpt-4o**                           | Draft report generation                       | Uses aggregated batch JSON + inspector notes |

---

# Updated Data Flow

```text
Images

↓

OpenCV

↓

EasyOCR

↓

Vision AI

↓

Inspection JSON

↓

LanceDB

↓

Dashboard

↓

Human Review

↓

AI Draft Report

↓

Final PDF

↓

AI Chat (RAG)
```

---

# Why this version is better

* ✅ **~60–80% lower LLM token usage** by eliminating repeated analysis and sending only structured JSON to downstream models.
* ✅ **Human-in-the-loop** reporting reflects real pharmaceutical quality assurance processes.
* ✅ **Deterministic calculations** (quality scores, statistics, charts) are handled locally instead of by AI.
* ✅ **RAG remains lightweight**, retrieving only the most relevant inspection records instead of entire histories.
* ✅ **Clear separation of responsibilities**: Vision AI analyzes images once, Python computes metrics, GPT-4o writes a polished draft, and the inspector provides the final approval and comments.

This architecture preserves all of the functionality in your original design while making it significantly more efficient, cheaper to run, and better suited to a hackathon demo. It also fits naturally as a replacement for your current `docs/arch.md` because it keeps the same overall structure while optimizing the AI pipeline and introducing the Human Review stage. 
