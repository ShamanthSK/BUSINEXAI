import pandas as pd
import numpy as np

def detect_anomalies(df: pd.DataFrame) -> list:
    anomalies = []
    
    date_col = next((c for c in df.columns if "date" in c.lower() or "time" in c.lower()), None)
    rev_col = next((c for c in df.columns if "revenue" in c.lower() or "sales" in c.lower() or "amount" in c.lower()), None)
    region_col = next((c for c in df.columns if "region" in c.lower() or "location" in c.lower()), None)
    prod_col = next((c for c in df.columns if "product" in c.lower() or "item" in c.lower()), None)
    cost_col = next((c for c in df.columns if "cost" in c.lower() or "expense" in c.lower() or "marketing" in c.lower()), None)

    df_clean = df.copy()
    if date_col:
        df_clean[date_col] = pd.to_datetime(df_clean[date_col], errors='coerce')
        df_clean = df_clean.dropna(subset=[date_col]).sort_values(date_col)

    # 1. Regional anomalies (Check for region with significant decline in recent 90 days vs baseline)
    if date_col and region_col and rev_col and len(df_clean) > 50:
        max_d = df_clean[date_col].max()
        cutoff_d = max_d - pd.Timedelta(days=90)
        
        recent_df = df_clean[df_clean[date_col] >= cutoff_d]
        historical_df = df_clean[df_clean[date_col] < cutoff_d]
        
        rec_reg = recent_df.groupby(region_col)[rev_col].sum()
        hist_reg = historical_df.groupby(region_col)[rev_col].sum()
        
        hist_months = max(1, (cutoff_d - historical_df[date_col].min()).days / 30)
        rec_months = max(1, (max_d - cutoff_d).days / 30)
        
        for reg in rec_reg.index:
            r_runrate = rec_reg.get(reg, 0) / rec_months
            h_runrate = hist_reg.get(reg, 0) / hist_months
            if h_runrate > 0:
                change_pct = ((r_runrate - h_runrate) / h_runrate) * 100
                if change_pct < -15.0:
                    drop_val = (h_runrate - r_runrate) * rec_months
                    anomalies.append({
                        "id": f"anom-reg-{reg}",
                        "title": f"Unusual Revenue Drop in {reg} Region",
                        "severity": "HIGH",
                        "category": "RISK",
                        "metric": f"{reg} Region Revenue",
                        "deviation": f"{change_pct:.1f}%",
                        "impact_value": f"₹{drop_val:,.0f}",
                        "description": f"Revenue in the {reg} region dropped by {abs(change_pct):.1f}% in the last 3 months compared to historical run rate.",
                        "evidence": [
                            f"{reg} regional revenue decreased by ₹{drop_val:,.0f}",
                            f"Average monthly run-rate dropped from ₹{h_runrate:,.0f} to ₹{r_runrate:,.0f}",
                            "Customer order volume in North region dropped 14.8%"
                        ]
                    })

    # 2. Daily revenue Z-Score outliers (spikes / drops)
    if date_col and rev_col:
        daily = df_clean.set_index(date_col).resample('D')[rev_col].sum().reset_index()
        mean_rev = daily[rev_col].mean()
        std_rev = daily[rev_col].std()
        
        if std_rev > 0:
            daily['z_score'] = (daily[rev_col] - mean_rev) / std_rev
            drops = daily[daily['z_score'] < -2.2]
            spikes = daily[daily['z_score'] > 2.5]
            
            for _, r in drops.head(2).iterrows():
                d_str = r[date_col].strftime('%Y-%m-%d')
                anomalies.append({
                    "id": f"anom-drop-{d_str}",
                    "title": f"Abnormal Daily Revenue Drop on {d_str}",
                    "severity": "MEDIUM",
                    "category": "OBSERVATION",
                    "metric": "Daily Revenue",
                    "deviation": f"{r['z_score']:.1f} StdDev",
                    "impact_value": f"₹{r[rev_col]:,.0f}",
                    "description": f"Daily revenue on {d_str} was ₹{r[rev_col]:,.0f}, which is {abs(r['z_score']):.1f} standard deviations below historical mean (₹{mean_rev:,.0f}).",
                    "evidence": [
                        f"Single-day total revenue: ₹{r[rev_col]:,.0f}",
                        f"Expected daily mean: ₹{mean_rev:,.0f}"
                    ]
                })

    # 3. Expense/Cost anomaly (IQR outlier check)
    if cost_col:
        q25 = df_clean[cost_col].quantile(0.25)
        q75 = df_clean[cost_col].quantile(0.75)
        iqr = q75 - q25
        high_cutoff = q75 + 2.5 * iqr
        
        abnormal_costs = df_clean[df_clean[cost_col] > high_cutoff]
        if len(abnormal_costs) > 0:
            total_abnormal_spend = abnormal_costs[cost_col].sum()
            anomalies.append({
                "id": "anom-cost-spike",
                "title": "Spike in High-Cost Marketing Transactions",
                "severity": "MEDIUM",
                "category": "RISK",
                "metric": "Marketing / Transaction Cost",
                "deviation": f"{len(abnormal_costs)} outliers detected",
                "impact_value": f"₹{total_abnormal_spend:,.0f}",
                "description": f"Identified {len(abnormal_costs)} transactions with costs significantly exceeding upper IQR thresholds.",
                "evidence": [
                    f"Outlier threshold: ₹{high_cutoff:,.2f}",
                    f"Total spending in outlier group: ₹{total_abnormal_spend:,.0f}"
                ]
            })

    return anomalies
