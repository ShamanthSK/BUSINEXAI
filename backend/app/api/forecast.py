from fastapi import APIRouter, Query
from app.api.dataset_store import get_dataset
from app.engine.forecaster import generate_forecast

router = APIRouter()

@router.get("/datasets/{dataset_id}/forecast")
def get_forecast(dataset_id: str, days: int = Query(90, ge=7, le=365)):
    df = get_dataset(dataset_id)
    return generate_forecast(df, horizon_days=days)
