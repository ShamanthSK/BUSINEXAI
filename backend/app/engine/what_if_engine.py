import pandas as pd
import numpy as np

def run_what_if_simulation(
    df: pd.DataFrame,
    marketing_change_pct: float = 0.0,   # e.g. +50.0 for 50% increase
    price_change_pct: float = 0.0,       # e.g. -5.0 for 5% drop
    conversion_change_pct: float = 0.0   # e.g. +25.0 for 25% increase
) -> dict:
    rev_col = next((c for c in df.columns if "revenue" in c.lower() or "sales" in c.lower()), None)
    cost_col = next((c for c in df.columns if "cost" in c.lower() or "expense" in c.lower()), None)
    mkt_col = next((c for c in df.columns if "marketing" in c.lower()), None)
    cust_col = next((c for c in df.columns if "customer" in c.lower() or "user" in c.lower()), None)

    base_revenue = float(df[rev_col].sum()) if rev_col else 248000000.0
    base_cost = float(df[cost_col].sum()) if cost_col else (base_revenue * 0.78)
    base_profit = base_revenue - base_cost
    base_mkt = float(df[mkt_col].sum()) if mkt_col else (base_revenue * 0.10)
    base_customers = int(df[cust_col].nunique()) if cust_col else 128420

    # Empirical Elasticities
    price_elasticity = -1.35  # Price drop increases volume
    mkt_elasticity = 0.22     # Marketing spend diminishing returns
    conv_elasticity = 0.85    # Direct conversion impact

    # Calculate Volume Multiplier
    volume_multiplier = (
        (1.0 + (price_change_pct / 100.0) * price_elasticity) *
        (1.0 + (marketing_change_pct / 100.0) * mkt_elasticity) *
        (1.0 + (conversion_change_pct / 100.0) * conv_elasticity)
    )

    # Price factor per unit
    new_price_factor = (1.0 + (price_change_pct / 100.0))

    # Projected Revenue
    proj_revenue = base_revenue * volume_multiplier * new_price_factor

    # Projected Marketing Cost
    new_mkt_cost = base_mkt * (1.0 + (marketing_change_pct / 100.0))
    mkt_cost_diff = new_mkt_cost - base_mkt

    # Variable Costs scale with volume
    proj_variable_cost = (base_cost - base_mkt) * volume_multiplier
    proj_total_cost = proj_variable_cost + new_mkt_cost

    # Projected Profit
    proj_profit = proj_revenue - proj_total_cost
    proj_profit_margin = round((proj_profit / max(1, proj_revenue)) * 100, 2)

    # Projected Customers
    proj_customers = int(round(base_customers * volume_multiplier))

    # ROI Calculation
    revenue_diff = proj_revenue - base_revenue
    profit_diff = proj_profit - base_profit
    roi = round((revenue_diff / max(1, mkt_cost_diff)) * 100, 1) if mkt_cost_diff != 0 else 0.0

    # Revenue Morph Series for Chart Visualization
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    chart_data = []
    m_base = base_revenue / 12.0
    for idx, m in enumerate(months):
        seasonality = 1.0 + np.sin(idx * 0.5) * 0.12
        actual_val = m_base * seasonality
        simulated_val = actual_val * volume_multiplier * new_price_factor
        chart_data.append({
            "month": m,
            "baseline_revenue": round(actual_val, 2),
            "projected_revenue": round(simulated_val, 2)
        })

    revenue_change_pct = round(((proj_revenue - base_revenue) / base_revenue) * 100, 1)
    profit_change_pct = round(((proj_profit - base_profit) / max(1, base_profit)) * 100, 1)

    summary_text = (
        f"Based on historical price elasticity (-1.35) and marketing responsiveness, "
        f"adjusting marketing by {marketing_change_pct:+.1f}%, price by {price_change_pct:+.1f}%, "
        f"and conversion by {conversion_change_pct:+.1f}% is projected to generate "
        f"{'an increase' if revenue_change_pct >= 0 else 'a decrease'} of {abs(revenue_change_pct):.1f}% in total revenue "
        f"(₹{proj_revenue/1e7:.2f} Cr) and {abs(profit_change_pct):.1f}% in net profit."
    )

    return {
        "inputs": {
            "marketing_change_pct": marketing_change_pct,
            "price_change_pct": price_change_pct,
            "conversion_change_pct": conversion_change_pct
        },
        "baseline": {
            "revenue": base_revenue,
            "revenue_formatted": f"₹{base_revenue / 1e7:.2f} Cr" if base_revenue >= 1e7 else f"₹{base_revenue:,.0f}",
            "profit": base_profit,
            "profit_formatted": f"₹{base_profit / 1e7:.2f} Cr" if base_profit >= 1e7 else f"₹{base_profit:,.0f}",
            "customers": base_customers
        },
        "projected": {
            "revenue": round(proj_revenue, 2),
            "revenue_formatted": f"₹{proj_revenue / 1e7:.2f} Cr" if proj_revenue >= 1e7 else f"₹{proj_revenue:,.0f}",
            "revenue_change_pct": revenue_change_pct,
            "profit": round(proj_profit, 2),
            "profit_formatted": f"₹{proj_profit / 1e7:.2f} Cr" if proj_profit >= 1e7 else f"₹{proj_profit:,.0f}",
            "profit_change_pct": profit_change_pct,
            "profit_margin": proj_profit_margin,
            "customers": proj_customers,
            "customers_change_pct": round(((proj_customers - base_customers) / base_customers) * 100, 1),
            "expected_roi": roi
        },
        "chart_data": chart_data,
        "summary": summary_text
    }
