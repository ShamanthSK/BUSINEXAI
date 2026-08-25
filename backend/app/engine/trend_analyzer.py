import pandas as pd
import numpy as np

def analyze_trends(df: pd.DataFrame) -> dict:
    date_col = next((c for c in df.columns if "date" in c.lower() or "time" in c.lower()), None)
    rev_col = next((c for c in df.columns if "revenue" in c.lower() or "sales" in c.lower() or "amount" in c.lower()), None)
    prod_col = next((c for c in df.columns if "product" in c.lower() or "item" in c.lower()), None)
    region_col = next((c for c in df.columns if "region" in c.lower() or "location" in c.lower() or "country" in c.lower()), None)
    cat_col = next((c for c in df.columns if "category" in c.lower() or "type" in c.lower()), None)

    df_clean = df.copy()
    if date_col:
        df_clean[date_col] = pd.to_datetime(df_clean[date_col], errors='coerce')
        df_clean = df_clean.dropna(subset=[date_col]).sort_values(date_col)

    # 1. Monthly revenue trend
    revenue_over_time = []
    if date_col and rev_col:
        monthly = df_clean.set_index(date_col).resample('ME')[rev_col].sum().reset_index()
        monthly['month_name'] = monthly[date_col].dt.strftime('%b %Y')
        revenue_over_time = [
            {"date": row['month_name'], "revenue": round(float(row[rev_col]), 2)}
            for _, row in monthly.iterrows()
        ]

    # 2. Sales by Product
    by_product = []
    if prod_col and rev_col:
        prod_grouped = df_clean.groupby(prod_col)[rev_col].sum().reset_index().sort_values(rev_col, ascending=False)
        total_r = df_clean[rev_col].sum()
        by_product = [
            {
                "product": str(row[prod_col]),
                "revenue": round(float(row[rev_col]), 2),
                "share": round(float(row[rev_col]) / max(1, total_r) * 100, 1)
            }
            for _, row in prod_grouped.head(10).iterrows()
        ]

    # 3. Sales by Region
    by_region = []
    if region_col and rev_col:
        region_grouped = df_clean.groupby(region_col)[rev_col].sum().reset_index().sort_values(rev_col, ascending=False)
        total_r = df_clean[rev_col].sum()
        by_region = [
            {
                "region": str(row[region_col]),
                "revenue": round(float(row[rev_col]), 2),
                "share": round(float(row[rev_col]) / max(1, total_r) * 100, 1)
            }
            for _, row in region_grouped.iterrows()
        ]

    # 4. Sales by Category
    by_category = []
    if cat_col and rev_col:
        cat_grouped = df_clean.groupby(cat_col)[rev_col].sum().reset_index().sort_values(rev_col, ascending=False)
        by_category = [
            {
                "category": str(row[cat_col]),
                "revenue": round(float(row[rev_col]), 2)
            }
            for _, row in cat_grouped.iterrows()
        ]

    # 5. Rising vs Declining Products (comparing last 90d vs previous 90d)
    rising_products = []
    declining_products = []
    if date_col and prod_col and rev_col and len(df_clean) > 20:
        max_d = df_clean[date_col].max()
        mid_d = max_d - pd.Timedelta(days=90)
        start_d = mid_d - pd.Timedelta(days=90)

        recent = df_clean[df_clean[date_col] >= mid_d].groupby(prod_col)[rev_col].sum()
        previous = df_clean[(df_clean[date_col] >= start_d) & (df_clean[date_col] < mid_d)].groupby(prod_col)[rev_col].sum()

        changes = []
        for p in recent.index:
            r_val = recent.get(p, 0)
            p_val = previous.get(p, 0)
            if p_val > 0:
                pct = ((r_val - p_val) / p_val) * 100
                changes.append({"product": p, "recent": r_val, "prev": p_val, "growth": round(pct, 1)})

        changes.sort(key=lambda x: x['growth'], reverse=True)
        rising_products = [c for c in changes if c['growth'] > 5][:5]
        declining_products = [c for c in changes if c['growth'] < -5][:5]

    return {
        "revenue_over_time": revenue_over_time,
        "by_product": by_product,
        "by_region": by_region,
        "by_category": by_category,
        "rising_products": rising_products,
        "declining_products": declining_products
    }
