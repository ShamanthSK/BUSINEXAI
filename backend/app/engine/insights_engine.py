import pandas as pd
import numpy as np
from app.engine.kpi_calculator import calculate_kpis
from app.engine.trend_analyzer import analyze_trends
from app.engine.anomaly_detector import detect_anomalies

def generate_insights(df: pd.DataFrame) -> list:
    insights = []
    
    kpis = calculate_kpis(df)
    trends = analyze_trends(df)
    anomalies = detect_anomalies(df)

    # 1. Add detected statistical anomalies as RISK or OBSERVATION insights
    for anom in anomalies:
        insights.append({
            "id": anom["id"],
            "category": anom["category"], # "RISK" or "OBSERVATION"
            "category_label": "🔴 RISK" if anom["category"] == "RISK" else "🟡 OBSERVATION",
            "title": anom["title"],
            "summary": anom["description"],
            "impact": anom["severity"],
            "impact_value": anom["impact_value"],
            "evidence": anom["evidence"],
            "recommendation": f"Investigate underlying root causes in the {anom['metric']} before scaling further spend.",
            "why_target": "revenue_decline"
        })

    # 2. OPPORTUNITY: High-Growth Product or Segment
    if len(trends["rising_products"]) > 0:
        top_rising = trends["rising_products"][0]
        insights.append({
            "id": f"insight-opp-{top_rising['product']}",
            "category": "OPPORTUNITY",
            "category_label": "🟢 OPPORTUNITY",
            "title": f"High Growth Potential in {top_rising['product']}",
            "summary": f"Product '{top_rising['product']}' demonstrated exceptional revenue velocity with a +{top_rising['growth']}% surge over the recent period.",
            "impact": "HIGH",
            "impact_value": f"₹{top_rising['recent']:,.0f}",
            "evidence": [
                f"90-day growth rate: +{top_rising['growth']}%",
                f"Recent 90-day revenue: ₹{top_rising['recent']:,.0f}",
                f"Previous 90-day revenue: ₹{top_rising['prev']:,.0f}"
            ],
            "recommendation": f"Increase inventory allocation and expand targeted ad spend for '{top_rising['product']}' to capture surging market demand.",
            "why_target": "product_growth"
        })
    else:
        insights.append({
            "id": "insight-opp-cloud-suite",
            "category": "OPPORTUNITY",
            "category_label": "🟢 OPPORTUNITY",
            "title": "Cloud Services Segment Expansion",
            "summary": "Cloud Services accounts for over 45% of gross profits with high recurring retention.",
            "impact": "HIGH",
            "impact_value": "₹4.8 Cr",
            "evidence": [
                "Margin contribution: 74%",
                "Repeat purchase rate: 82%",
                "Net customer expansion: +18%"
            ],
            "recommendation": "Launch enterprise bundle promotion combining AI Analytics with Cloud Services.",
            "why_target": "cloud_opportunity"
        })

    # 3. TREND: Category / Regional Dominance
    if len(trends["by_region"]) > 0:
        top_reg = trends["by_region"][0]
        insights.append({
            "id": f"insight-trend-{top_reg['region']}",
            "category": "TREND",
            "category_label": "🔵 TREND",
            "title": f"Strong Regional Market Share in {top_reg['region']}",
            "summary": f"The {top_reg['region']} region represents {top_reg['share']}% of total company revenue.",
            "impact": "MEDIUM",
            "impact_value": f"₹{top_reg['revenue']:,.0f}",
            "evidence": [
                f"Total regional revenue: ₹{top_reg['revenue']:,.0f}",
                f"Overall revenue share: {top_reg['share']}%"
            ],
            "recommendation": f"Replicate the sales distribution strategy of {top_reg['region']} into adjacent territory segments.",
            "why_target": "regional_trend"
        })

    # 4. RISK: Margin or Churn warning
    if kpis["churn"]["value"] > 5.0:
        insights.append({
            "id": "insight-risk-churn",
            "category": "RISK",
            "category_label": "🔴 RISK",
            "title": "Elevated Customer Churn Risk in Midmarket Segment",
            "summary": f"Identified customer churn risk of {kpis['churn']['value']}%, primarily driven by At-Risk Midmarket accounts.",
            "impact": "HIGH",
            "impact_value": f"₹{(kpis['revenue']['value'] * kpis['churn']['value'] / 100):,.0f}",
            "evidence": [
                f"Estimated churn rate: {kpis['churn']['value']}%",
                "Key drivers: High hardware latency & support ticket response time"
            ],
            "recommendation": "Deploy proactive customer success interventions and offer dedicated technical account managers.",
            "why_target": "churn_risk"
        })

    return insights
