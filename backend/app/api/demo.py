from fastapi import APIRouter
from app.api.dataset_store import get_dataset
from app.engine.profiler import profile_dataset

router = APIRouter()

@router.get("/demo")
def get_demo_dataset_info():
    df = get_dataset("demo")
    profile = profile_dataset(df)
    return {
        "dataset_id": "demo",
        "name": "Retail Business — 24 Months",
        "description": "Rich enterprise dataset spanning 24 months of multi-regional sales, cloud products, customer segments, and marketing metrics.",
        "rows": len(df),
        "columns": len(df.columns),
        "health_score": profile["health_score"],
        "profile": profile
    }
