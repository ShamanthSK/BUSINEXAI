import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.api import upload, datasets, insights, forecast, what_if, chat, reports, demo, health

app = FastAPI(
    title="STRATOS AI Platform API",
    description="Futuristic AI-powered Business Intelligence & Strategic Decision Platform",
    version="1.0.0"
)

# Enable CORS for local development & cloud deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(upload.router, prefix="/api", tags=["Upload"])
app.include_router(datasets.router, prefix="/api", tags=["Datasets"])
app.include_router(insights.router, prefix="/api", tags=["Insights"])
app.include_router(forecast.router, prefix="/api", tags=["Forecast"])
app.include_router(what_if.router, prefix="/api", tags=["What-If Simulator"])
app.include_router(chat.router, prefix="/api", tags=["Ask Your Data"])
app.include_router(reports.router, prefix="/api", tags=["Executive Reports"])
app.include_router(demo.router, prefix="/api", tags=["Demo"])

# Serve static frontend in production if built
frontend_dist = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="static")
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
