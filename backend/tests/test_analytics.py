import sys
import os
import pytest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.demo.generate_demo_data import generate_retail_demo_data
from app.api.dataset_store import get_dataset
from app.engine.profiler import profile_dataset
from app.engine.kpi_calculator import calculate_kpis
from app.engine.trend_analyzer import analyze_trends
from app.engine.anomaly_detector import detect_anomalies
from app.engine.forecaster import generate_forecast
from app.engine.what_if_engine import run_what_if_simulation
from app.engine.nl_query_engine import process_natural_language_query

def test_full_analytics_pipeline():
    # 1. Get demo dataset
    df = get_dataset("demo")
    assert len(df) > 100
    assert "revenue" in df.columns

    # 2. Profile dataset
    profile = profile_dataset(df)
    assert profile["total_rows"] > 100
    assert profile["health_score"] >= 80

    # 3. KPIs
    kpis = calculate_kpis(df)
    assert kpis["revenue"]["value"] > 0
    assert kpis["profit"]["margin"] > 0

    # 4. Trends
    trends = analyze_trends(df)
    assert len(trends["by_region"]) > 0
    assert len(trends["by_product"]) > 0

    # 5. Anomalies
    anomalies = detect_anomalies(df)
    assert isinstance(anomalies, list)

    # 6. Forecasting
    fc = generate_forecast(df, horizon_days=90)
    assert fc["horizon_days"] == 90
    assert len(fc["forecast"]) > 0

    # 7. What-If Simulation
    sim = run_what_if_simulation(df, marketing_change_pct=25.0, price_change_pct=-5.0)
    assert sim["projected"]["revenue"] > 0

    # 8. NL Query
    nl_res = process_natural_language_query(df, "Show revenue by region")
    assert nl_res["chart"]["type"] == "bar"
    assert len(nl_res["chart"]["data"]) > 0

if __name__ == "__main__":
    test_full_analytics_pipeline()
    print("ALL BACKEND ANALYTICS TESTS PASSED!")
