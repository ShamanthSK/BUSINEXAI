import os
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_retail_demo_data(file_path: str):
    np.random.seed(42)
    
    # 24 months ending Aug 2026
    start_date = datetime(2024, 9, 1)
    dates = [start_date + timedelta(days=i) for i in range(730)] # ~24 months
    
    products = [
        {"id": "PROD-101", "name": "Stratos Enterprise Suite", "category": "Cloud Services", "price": 4500, "cost": 1200, "base_demand": 45},
        {"id": "PROD-102", "name": "AI Analytics Engine Pro", "category": "Enterprise AI", "price": 8200, "cost": 2100, "base_demand": 30},
        {"id": "PROD-103", "name": "Legacy Data Server V1", "category": "Hardware", "price": 3100, "cost": 2200, "base_demand": 15},
        {"id": "PROD-104", "name": "Smart Edge Gateway", "category": "Hardware", "price": 1800, "cost": 950, "base_demand": 50},
        {"id": "PROD-105", "name": "Strategic BI Advisory", "category": "Advisory", "price": 12000, "cost": 4500, "base_demand": 12},
        {"id": "PROD-106", "name": "Automated ETL Pipeline", "category": "Cloud Services", "price": 2900, "cost": 700, "base_demand": 60},
    ]
    
    regions = ["North", "South", "East", "West", "Central", "APAC", "EMEA"]
    region_weights = [0.22, 0.18, 0.15, 0.20, 0.10, 0.08, 0.07]
    
    segments = ["High-Value Enterprise", "Growth SMB", "At-Risk Midmarket", "New Startup"]
    segment_weights = [0.25, 0.40, 0.20, 0.15]
    
    rows = []
    t_id = 10001
    
    for current_date in dates:
        date_str = current_date.strftime("%Y-%m-%d")
        month_idx = (current_date.year - 2024) * 12 + current_date.month
        
        # Seasonality & general growth trend (+12% growth over time)
        trend_factor = 1.0 + (month_idx * 0.015)
        seasonality = 1.15 if current_date.month in [11, 12, 3] else (0.88 if current_date.month in [7, 8] else 1.0)
        
        # Daily transaction count
        num_tx = np.random.randint(3, 8)
        
        for _ in range(num_tx):
            prod = np.random.choice(products)
            region = np.random.choice(regions, p=region_weights)
            segment = np.random.choice(segments, p=segment_weights)
            
            # Anomaly injection: North region dip in recent 3 months (Jun-Aug 2026) for PROD-103 & PROD-101
            region_modifier = 1.0
            if region == "North" and current_date >= datetime(2026, 5, 1):
                region_modifier = 0.72 # 28% drop in North in Q3 2026
                
            # Demand calculation
            units = int(np.maximum(1, np.random.poisson(prod["base_demand"] / 30.0) * trend_factor * seasonality * region_modifier))
            if units == 0:
                units = 1
                
            unit_price = prod["price"]
            revenue = round(units * unit_price * np.random.uniform(0.95, 1.05), 2)
            cost = round(units * prod["cost"], 2)
            profit = round(revenue - cost, 2)
            marketing_spend = round(revenue * np.random.uniform(0.08, 0.14), 2)
            
            customer_id = f"CUST-{np.random.randint(100, 999)}"
            churn_risk = "High" if segment == "At-Risk Midmarket" or (prod["id"] == "PROD-103" and np.random.rand() > 0.4) else ("Medium" if np.random.rand() > 0.7 else "Low")
            
            rows.append({
                "transaction_id": f"TX-{t_id}",
                "date": date_str,
                "product_id": prod["id"],
                "product_name": prod["name"],
                "category": prod["category"],
                "region": region,
                "units_sold": units,
                "unit_price": unit_price,
                "revenue": revenue,
                "cost": cost,
                "profit": profit,
                "marketing_spend": marketing_spend,
                "customer_id": customer_id,
                "customer_segment": segment,
                "churn_risk": churn_risk
            })
            t_id += 1
            
    df = pd.DataFrame(rows)
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    df.to_csv(file_path, index=False)
    print(f"Generated demo dataset with {len(df)} rows at {file_path}")

if __name__ == "__main__":
    generate_retail_demo_data("e:/track2/backend/app/demo/retail_demo.csv")
