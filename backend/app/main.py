import asyncio
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routes import devices, energy, rooms, websocket
from app.services.mqtt_service import set_event_loop, start_mqtt, stop_mqtt

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")

app = FastAPI(title=settings.app_name, version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rooms.router)
app.include_router(devices.router)
app.include_router(energy.router)
app.include_router(websocket.router)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.on_event("startup")
async def on_startup():
    set_event_loop(asyncio.get_running_loop())
    start_mqtt()


@app.on_event("shutdown")
async def on_shutdown():
    stop_mqtt()
