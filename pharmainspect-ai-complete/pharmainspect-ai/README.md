# PharmaInspect AI

Enterprise, human-in-the-loop pharmaceutical packaging inspection demo.

## Run backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Run frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173  
API docs: http://localhost:8000/docs

The project runs without cloud credentials using deterministic demo adapters. Replace adapters in `backend/app/infrastructure` for Azure AI, EasyOCR, and LanceDB.

## Good-image retrieval inspection

The inspection adapter vectorizes approved reference images and retrieves the
closest good examples for each uploaded image. Configure the reference corpus
and acceptance threshold before starting the backend:

```powershell
$env:PHARMA_GOOD_IMAGES_DIR="C:\path\to\approved\good"
$env:PHARMA_GOOD_IMAGE_THRESHOLD="0.90"
$env:PHARMA_IMAGE_RELEVANCE_THRESHOLD="0.50"
uvicorn app.main:app --reload
```

Images below the relevance threshold are marked invalid and excluded from
quality-score calculations. Relevant packaging images between the relevance
and acceptance thresholds are recorded as failed inspections.

The default local reference directory is
`C:\Users\GenAIHYDADBUSR103\Desktop\Images\data\good`. If that directory is
unavailable, the application retains the deterministic demo inspector as a
safe fallback.

## TCS GenAI Lab assistant

The Quality Assistant can use the hackathon-provided TCS GenAI Lab endpoint
with the documented DeepSeek V3 chat model. Configure credentials in the
backend process environment; never commit a real key:

```powershell
$env:TCS_AI_API_KEY="<your rotated event key>"
$env:TCS_AI_BASE_URL="https://genailab.tcs.in"
$env:TCS_AI_MODEL="azure_ai/genailab-maas-DeepSeek-V3-0324"
$env:TCS_AI_VERIFY_SSL="false"
uvicorn app.main:app --reload
```

The model receives a bounded JSON context containing structured batch,
inspection, metric, and human-review records. The existing scope guard runs
before the model call. If the TCS service is unavailable, the application
returns a transparent local rule-based fallback response.
# friday-demo
