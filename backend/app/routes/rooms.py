from fastapi import APIRouter, HTTPException

from app.services.runtime import state

router = APIRouter(prefix="/api/rooms", tags=["rooms"])


@router.get("")
def get_rooms():
    return state.get_rooms()


@router.get("/{room_id}")
def get_room(room_id: str):
    room = state.get_room(room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return room


@router.put("/{room_id}/config")
def update_room_config(room_id: str, config_update: dict):
    room = state.update_room_config(room_id, config_update)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return room
