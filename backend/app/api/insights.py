from fastapi import APIRouter
from app.api.dataset_store import get_dataset
from app.engine.kpi_calculator import calculate_kpis
from app.engine.trend_analyzer import analyze_trends
from app.engine.insights_engine import generate_insights
from app.engine.causal_engine import explain_metric_causality

router = APIRouter()

@router.get("/datasets/{dataset_id}/metrics")
def get_metrics(dataset_id: str):
    df = get_dataset(dataset_id)
    kpis = calculate_kpis(df)
    trends = analyze_trends(df)
    return {
        "kpis": kpis,
        "trends": trends
    }

@router.get("/datasets/{dataset_id}/insights")
def get_dataset_insights(dataset_id: str):
    df = get_dataset(dataset_id)
    return {
        "insights": generate_insights(df)
    }

@router.get("/datasets/{dataset_id}/why")
def get_causal_explanation(dataset_id: str, metric: str = "Revenue"):
    df = get_dataset(dataset_id)
    return explain_metric_causality(df, metric)
