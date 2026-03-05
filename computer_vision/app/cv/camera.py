"""
Camera handler module.
"""
import os
import cv2
from app.config import CAMERA_SOURCE


def _resolve_camera_source():
    raw = os.getenv("WW_CAMERA_SOURCE", str(CAMERA_SOURCE)).strip()
    if raw.isdigit():
        return int(raw)
    return raw


def get_camera():
    """Initialize and return camera stream."""
    source = _resolve_camera_source()

    # Use DirectShow for local camera index on Windows, generic backend otherwise.
    if isinstance(source, int):
        cap = cv2.VideoCapture(source, cv2.CAP_DSHOW)
    else:
        cap = cv2.VideoCapture(source)

    # Safety check: ensure camera opened successfully
    if not cap.isOpened():
        raise RuntimeError(f"Could not open camera source: {source}")

    return cap
