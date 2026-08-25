# STRATOS AI — Deployment Guide

This guide details how to deploy **STRATOS AI** to **Google Cloud Run** or locally using Docker.

---

## 1. Prerequisites

- [Google Cloud SDK (gcloud CLI)](https://cloud.google.com/sdk/docs/install) installed and authenticated.
- Docker Desktop / Docker Engine installed.
- GCP Project with billing enabled.

---

## 2. Local Docker Stack Execution

To build and run the full stack locally:

```bash
docker-compose up --build -d
```

The application will be accessible at:
- **Web Command Center**: `http://localhost:8000`
- **FastAPI OpenAPI Documentation**: `http://localhost:8000/docs`

---

## 3. Deploying to Google Cloud Run

### Step 1: Set GCP Environment Variables

```bash
export PROJECT_ID="YOUR_GCP_PROJECT_ID"
export REGION="us-central1"
gcloud config set project $PROJECT_ID
```

### Step 2: Enable GCP APIs

```bash
gcloud services enable run.googleapis.com containerregistry.googleapis.com secretmanager.googleapis.com
```

### Step 3: Build & Push Container Image to Google Container Registry (GCR)

```bash
gcloud builds submit --tag gcr.io/$PROJECT_ID/stratos-ai:latest .
```

### Step 4: Create Secret for Gemini API Key (Optional)

```bash
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets create gemini-api-key --data-file=-
```

### Step 5: Deploy Service to Cloud Run

```bash
gcloud run deploy stratos-ai \
  --image gcr.io/$PROJECT_ID/stratos-ai:latest \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

Once deployment completes, `gcloud` will output the live HTTPS Service URL!

---

## 4. Verification & Health Monitoring

Verify deployment status via the health check endpoint:

```bash
curl https://<YOUR-CLOUD-RUN-URL>/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "STRATOS AI Engine",
  "version": "1.0.0"
}
```
