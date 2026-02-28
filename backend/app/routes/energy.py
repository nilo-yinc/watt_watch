from fastapi import APIRouter

from app.services.runtime import state

router = APIRouter(prefix="/api/energy", tags=["energy"])


@router.get("/logs")
def get_energy_logs():
    return state.energy_logs()


@router.get("/stats")
def get_energy_stats():
    return state.energy_stats()


@router.get("/savings")
def get_energy_savings():
    return state.energy_savings()
