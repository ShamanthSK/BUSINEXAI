from fastapi import APIRouter
from pydantic import BaseModel
from app.api.dataset_store import get_dataset
from app.engine.nl_query_engine import process_natural_language_query

router = APIRouter()

class ChatRequest(BaseModel):
    question: str

@router.post("/datasets/{dataset_id}/ask")
def ask_your_data(dataset_id: str, req: ChatRequest):
    df = get_dataset(dataset_id)
    return process_natural_language_query(df, req.question)
