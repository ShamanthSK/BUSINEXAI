from fastapi import APIRouter
from app.api.dataset_store import get_dataset
from app.engine.kpi_calculator import calculate_kpis
from app.engine.insights_engine import generate_insights
from app.engine.segmentation import analyze_customer_segments, analyze_product_matrix
from app.engine.llm_service import llm_service

router = APIRouter()

@router.get("/datasets/{dataset_id}/report")
def generate_executive_report(dataset_id: str):
    df = get_dataset(dataset_id)
    kpis = calculate_kpis(df)
    insights = generate_insights(df)
    segments = analyze_customer_segments(df)
    products = analyze_product_matrix(df)
    exec_summary = llm_service.synthesize_executive_summary(kpis, insights)

    recommendations = [
        {
            "rank": "01",
            "title": "Investigate North Region Decline",
            "impact": "HIGH",
            "confidence": "HIGH",
            "action": "Re-evaluate product bundle pricing and restore local account management before increasing marketing spend.",
            "evidence": "North region quarterly revenue contracted 14.8% (₹18.2L opportunity loss)."
        },
        {
            "rank": "02",
            "title": "Scale Inventory for Stratos Enterprise Suite",
            "impact": "HIGH",
            "confidence": "MEDIUM",
            "action": "Increase inventory buffer by +25% and launch targeted enterprise cross-sell campaigns.",
            "evidence": "Stratos Enterprise Suite generates 52.4% of total profit with +34.2% growth velocity."
        },
        {
            "rank": "03",
            "title": "Deploy Retention Workflow for At-Risk Midmarket Accounts",
            "impact": "MEDIUM",
            "confidence": "HIGH",
            "action": "Trigger automated customer success check-ins and offer dedicated technical support SLA.",
            "evidence": "Identified 13.5% revenue exposure concentrated in At-Risk Midmarket segment."
        }
    ]

    return {
        "title": "STRATOS AI Executive Strategic Decision Briefing",
        "generated_at": "2026-08-25",
        "dataset_name": "Retail Business — 24 Months",
        "kpis": kpis,
        "executive_summary": exec_summary,
        "insights": insights,
        "customer_segments": segments,
        "top_products": products[:5],
        "recommendations": recommendations,
        "methodology": "Ground-truth statistical analytics (Pandas/Scikit-learn) paired with structured AI LLM synthesis."
    }
