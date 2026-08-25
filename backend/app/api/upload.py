from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
import io
import uuid
from app.api.dataset_store import set_dataset
from app.engine.profiler import profile_dataset

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    filename = file.filename.lower()
    content = await file.read()
    
    try:
        if filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(content))
        elif filename.endswith(".xlsx") or filename.endswith(".xls"):
            df = pd.read_excel(io.BytesIO(content))
        elif filename.endswith(".json"):
            df = pd.read_json(io.BytesIO(content))
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload a CSV, XLSX, or JSON file.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse file: {str(e)}")

    if len(df) == 0:
        raise HTTPException(status_code=400, detail="The uploaded dataset is empty.")

    dataset_id = f"ds_{uuid.uuid4().hex[:8]}"
    set_dataset(dataset_id, df)
    profile = profile_dataset(df)

    return {
        "dataset_id": dataset_id,
        "filename": file.filename,
        "rows": len(df),
        "columns": len(df.columns),
        "health_score": profile["health_score"],
        "profile": profile,
        "message": "Dataset uploaded and analyzed successfully."
    }
