import pandas as pd
import numpy as np

def profile_dataset(df: pd.DataFrame) -> dict:
    total_rows = len(df)
    total_cols = len(df.columns)
    
    col_details = []
    num_cols = []
    cat_cols = []
    date_cols = []
    
    missing_cells = 0
    total_cells = total_rows * total_cols
    
    for col in df.columns:
        null_count = int(df[col].isnull().sum())
        missing_cells += null_count
        dtype_str = str(df[col].dtype)
        
        is_date = False
        if "date" in col.lower() or "time" in col.lower():
            try:
                pd.to_datetime(df[col].dropna().head(10))
                is_date = True
            except:
                pass
                
        if is_date or "datetime" in dtype_str:
            col_type = "date"
            date_cols.append(col)
        elif pd.api.types.is_numeric_dtype(df[col]):
            col_type = "numeric"
            num_cols.append(col)
        else:
            col_type = "categorical"
            cat_cols.append(col)
            
        col_details.append({
            "name": col,
            "type": col_type,
            "null_count": null_count,
            "unique_count": int(df[col].nunique()),
            "sample_values": df[col].dropna().head(3).tolist()
        })
        
    duplicate_rows = int(df.duplicated().sum())
    
    # Calculate health score (0-100)
    completeness = max(0, 100 - (missing_cells / max(1, total_cells) * 100))
    uniqueness = max(0, 100 - (duplicate_rows / max(1, total_rows) * 100))
    health_score = int(round(completeness * 0.7 + uniqueness * 0.3))
    
    # Date range detection
    date_range = {"start": None, "end": None, "months_covered": 0}
    if date_cols:
        try:
            d_series = pd.to_datetime(df[date_cols[0]].dropna())
            date_range["start"] = str(d_series.min().date())
            date_range["end"] = str(d_series.max().date())
            days = (d_series.max() - d_series.min()).days
            date_range["months_covered"] = max(1, round(days / 30))
        except Exception:
            pass

    return {
        "total_rows": total_rows,
        "total_cols": total_cols,
        "health_score": health_score,
        "missing_cells": missing_cells,
        "duplicate_rows": duplicate_rows,
        "numeric_columns": num_cols,
        "categorical_columns": cat_cols,
        "date_columns": date_cols,
        "columns": col_details,
        "date_range": date_range,
        "summary_text": f"{total_rows:,} records across {total_cols} columns ({date_range['months_covered']} months coverage)."
    }
