"""
HTTP endpoints for the computer_vision module to POST detection data
and ghost frames directly, bypassing MQTT.
"""
from fastapi import APIRouter, Request

from app.services.runtime import state, ws_manager

router = APIRouter(prefix="/api/cv", tags=["computer_vision"])


@router.post("/data")
async def ingest_cv_data(request: Request):
    """
    Receive CV detection payload (person_count, appliance_on, waste_detected, etc.)
    and broadcast room + alert updates to all WebSocket clients.
    """
    data = await request.json()
    room_id = data.get("room_id")
    if not room_id:
        return {"error": "room_id required"}

    updated_room, alert = state.update_room_from_cv(room_id, data)
    if updated_room:
        await ws_manager.broadcast_json({"type": "room_update", "payload": updated_room})
    if alert:
        await ws_manager.broadcast_json({"type": "alert", "payload": alert})

    return {"ok": True}


@router.post("/ghost-frame")
async def ingest_ghost_frame(request: Request):
    """
    Receive a privacy-blurred ghost frame (base64 JPEG) and broadcast
    to all WebSocket clients for the Ghost View page.
    """
    data = await request.json()
    room_id = data.get("room_id")
    image_b64 = data.get("image_b64", "")
    timestamp = data.get("timestamp", 0)

    if not room_id or not image_b64:
        return {"error": "room_id and image_b64 required"}

    await ws_manager.broadcast_json({
        "type": "ghost_frame",
        "payload": {
            "room_id": room_id,
            "image_b64": image_b64,
            "timestamp": timestamp,
        },
    })

    return {"ok": True}
