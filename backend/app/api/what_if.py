from fastapi import APIRouter
from pydantic import BaseModel
from app.api.dataset_store import get_dataset
from app.engine.what_if_engine import run_what_if_simulation

router = APIRouter()

class WhatIfRequest(BaseModel):
    marketing_change_pct: float = 0.0
    price_change_pct: float = 0.0
    conversion_change_pct: float = 0.0

@router.post("/datasets/{dataset_id}/what-if")
def simulate_what_if(dataset_id: str, req: WhatIfRequest):
    df = get_dataset(dataset_id)
    return run_what_if_simulation(
        df,
        marketing_change_pct=req.marketing_change_pct,
        price_change_pct=req.price_change_pct,
        conversion_change_pct=req.conversion_change_pct
    )
