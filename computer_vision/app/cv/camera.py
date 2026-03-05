"""
Camera handler module.
"""
import os
import time
import cv2
import numpy as np
from app.config import CAMERA_SOURCE


class DummyCapture:
    """Synthetic frame source for headless/cloud deployments."""

    def __init__(self, width=640, height=480, fps=2):
        self._w, self._h = width, height
        self._delay = 1.0 / fps
        self._opened = True
        self._frame_num = 0

    def isOpened(self):
        return self._opened

    def read(self):
        if not self._opened:
            return False, None
        time.sleep(self._delay)
        self._frame_num += 1
        frame = np.zeros((self._h, self._w, 3), dtype=np.uint8)
        # Dark background with subtle grid
        for y in range(0, self._h, 40):
            cv2.line(frame, (0, y), (self._w, y), (20, 30, 20), 1)
        for x in range(0, self._w, 40):
            cv2.line(frame, (x, 0), (x, self._h), (20, 30, 20), 1)
        cv2.putText(frame, "WATT-WATCH CV", (100, 200),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 255, 0), 3)
        cv2.putText(frame, "Cloud Mode - No Camera", (120, 260),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (200, 200, 200), 2)
        cv2.putText(frame, f"Frame #{self._frame_num}", (220, 320),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)
        return True, frame

    def release(self):
        self._opened = False


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
        # Fallback to synthetic frames on headless/cloud servers
        if os.getenv("WW_DUMMY_CAMERA", "0") == "1":
            print("[camera] No real camera — using DummyCapture for cloud mode")
            return DummyCapture()
        raise RuntimeError(f"Could not open camera source: {source}")

    return cap
