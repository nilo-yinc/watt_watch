"""
Camera handler module.
"""
import cv2
from app.config import CAMERA_SOURCE

def get_camera():
    """Initialize and return camera stream."""
    # On Windows, MSMF may fail to grab frames when camera is busy.
    # Try DirectShow first, then fallback to default backend.
    cap = cv2.VideoCapture(CAMERA_SOURCE, cv2.CAP_DSHOW)
    if not cap.isOpened():
        cap = cv2.VideoCapture(CAMERA_SOURCE)

    # Safety check: ensure camera opened successfully
    if not cap.isOpened():
        raise RuntimeError("Could not open camera. Check CAMERA_SOURCE.")

    # Reduce backend-induced frame corruption/latency on some webcams.
    cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
    try:
        cap.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc(*"MJPG"))
    except Exception:
        pass

    # Warm-up: discard a few initial unstable frames.
    for _ in range(5):
        cap.read()

    return cap
