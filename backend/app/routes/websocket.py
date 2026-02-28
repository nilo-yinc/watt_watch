from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.services.runtime import state, ws_manager

router = APIRouter(tags=["websocket"])


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        await websocket.send_json({"type": "snapshot", "payload": {"rooms": state.get_rooms(), "devices": state.get_devices()}})
        while True:
            # Keep socket alive and accept incoming pings/commands in future.
            await websocket.receive_text()
    except WebSocketDisconnect:
        await ws_manager.disconnect(websocket)
    except Exception:
        await ws_manager.disconnect(websocket)
