from fastapi import APIRouter, HTTPException, Query
from app.api.dataset_store import get_dataset
from app.engine.profiler import profile_dataset
from app.engine.segmentation import analyze_customer_segments, analyze_product_matrix

router = APIRouter()

@router.get("/datasets/{dataset_id}/profile")
def get_dataset_profile(dataset_id: str):
    df = get_dataset(dataset_id)
    return profile_dataset(df)

@router.get("/datasets/{dataset_id}/explorer")
def get_dataset_explorer(
    dataset_id: str,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=500),
    search: str = Query(None)
):
    df = get_dataset(dataset_id)
    
    if search:
        mask = df.astype(str).apply(lambda row: row.str.contains(search, case=False).any(), axis=1)
        filtered_df = df[mask]
    else:
        filtered_df = df

    total_rows = len(filtered_df)
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit

    paged_df = filtered_df.iloc[start_idx:end_idx].fillna("")

    return {
        "dataset_id": dataset_id,
        "page": page,
        "limit": limit,
        "total_rows": total_rows,
        "total_pages": max(1, (total_rows + limit - 1) // limit),
        "columns": list(df.columns),
        "rows": paged_df.to_dict(orient="records")
    }

@router.get("/datasets/{dataset_id}/segments")
def get_customer_segments(dataset_id: str):
    df = get_dataset(dataset_id)
    return {
        "customer_segments": analyze_customer_segments(df),
        "product_matrix": analyze_product_matrix(df)
    }
