import os
import pandas as pd

_DATASET_STORE = {}

DEMO_PATH = os.path.join(os.path.dirname(__file__), "..", "demo", "retail_demo.csv")

def get_dataset(dataset_id: str = "demo") -> pd.DataFrame:
    if dataset_id in _DATASET_STORE:
        return _DATASET_STORE[dataset_id]
    
    # Load demo dataset if requesting 'demo' or default fallback
    if os.path.exists(DEMO_PATH):
        df = pd.read_csv(DEMO_PATH)
        _DATASET_STORE["demo"] = df
        return df
    else:
        # Generate demo data if file missing
        from app.demo.generate_demo_data import generate_retail_demo_data
        generate_retail_demo_data(DEMO_PATH)
        df = pd.read_csv(DEMO_PATH)
        _DATASET_STORE["demo"] = df
        return df

def set_dataset(dataset_id: str, df: pd.DataFrame):
    _DATASET_STORE[dataset_id] = df
