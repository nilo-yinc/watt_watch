import os
import threading
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.state import latest_state, latest_metrics
from app.api.schemas import IngestPayload, MetricsResponse, StatusResponse


def _start_cv_worker() -> None:
    # Import lazily so Render/API-only mode avoids CV/camera side effects.
    from app.main import main as cv_main

    cv_main()


@asynccontextmanager
async def lifespan(_: FastAPI):
    run_cv = os.getenv("RUN_CV", "0") == "1"
    if run_cv:
        threading.Thread(target=_start_cv_worker, daemon=True).start()
    yield


app = FastAPI(title="Watt-Watch API", version="2.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ALLOW_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Watt-Watch FastAPI running"}


@app.get("/healthz")
def healthz():
    return {
        "ok": True,
        "service": "watt-watch-cv-api",
        "run_cv": os.getenv("RUN_CV", "0") == "1",
    }


@app.get("/status", response_model=StatusResponse)
def get_status():
    return latest_state


@app.get("/metrics", response_model=MetricsResponse)
def get_metrics():
    return latest_metrics


@app.post("/ingest")
def ingest(payload: IngestPayload):
    if payload.status is not None:
        status_updates = payload.status.model_dump(exclude_none=True)
        latest_state.update(status_updates)

    if payload.metrics is not None:
        metrics_updates = payload.metrics.model_dump(exclude_none=True)
        latest_metrics.update(metrics_updates)

    return {"ok": True, "status": latest_state, "metrics": latest_metrics}
