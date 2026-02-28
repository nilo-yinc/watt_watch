from fastapi import APIRouter, HTTPException

from app.services.mqtt_service import mqtt_client
from app.services.runtime import state

router = APIRouter(prefix="/api/devices", tags=["devices"])


@router.get("")
def get_devices():
    return state.get_devices()


@router.post("/{device_id}/toggle")
def toggle_device(device_id: str):
    device = state.toggle_device(device_id, source="api")
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    mqtt_client.publish(device["command_topic"], "ON" if device["is_on"] else "OFF")
    return device
