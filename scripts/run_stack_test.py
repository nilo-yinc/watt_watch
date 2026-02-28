import json
import os
import subprocess
import sys
import time
from pathlib import Path

import requests


ROOT = Path(__file__).resolve().parents[1]
BACKEND_DIR = ROOT / "backend"
FRONTEND_DIR = ROOT / "frontend"
IOT_DIR = ROOT / "iot"


def wait_http(url: str, timeout_s: int = 60) -> bool:
    start = time.time()
    while time.time() - start < timeout_s:
        try:
            r = requests.get(url, timeout=3)
            if r.status_code < 500:
                return True
        except Exception:
            pass
        time.sleep(1.0)
    return False


def run():
    procs = []
    try:
        # 1) Local MQTT broker fallback (if Docker broker is unavailable).
        procs.append(
            subprocess.Popen(
                ["node", "scripts/local_mqtt_broker.mjs"],
                cwd=BACKEND_DIR,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
            )
        )
        time.sleep(2)

        # 2) Backend (Express).
        procs.append(
            subprocess.Popen(
                ["node", "src/server.js"],
                cwd=BACKEND_DIR,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
            )
        )

        if not wait_http("http://localhost:8000/health", timeout_s=60):
            raise RuntimeError("Backend did not become healthy on :8000")

        # 3) Frontend (Vite dev server).
        procs.append(
            subprocess.Popen(
                ["npm", "run", "dev", "--", "--host", "127.0.0.1", "--port", "5173"],
                cwd=FRONTEND_DIR,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
            )
        )
        if not wait_http("http://127.0.0.1:5173", timeout_s=90):
            raise RuntimeError("Frontend did not become ready on :5173")

        # 4) IoT relay simulator.
        procs.append(
            subprocess.Popen(
                [sys.executable, "firmware/simulated_relay.py", "--room", "room-102", "--device", "light"],
                cwd=IOT_DIR,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
            )
        )
        time.sleep(2)

        # 5) Webcam capture quick test (Laptop webcam index 0).
        webcam_ok = False
        webcam_error = None
        try:
            import cv2

            cap = cv2.VideoCapture(0)
            ok, frame = cap.read()
            cap.release()
            if ok and frame is not None:
                webcam_ok = True
        except Exception as exc:
            webcam_error = str(exc)

        # 6) Simulate one CV waste event to verify backend->IoT command loop.
        import paho.mqtt.publish as publish

        payload = {
            "timestamp": int(time.time()),
            "room_id": "room-102",
            "person_count": 0,
            "appliance_on": True,
            "brightness": 142.7,
            "waste_detected": True,
            "latency_ms": 125,
            "privacy_mode": "blur",
        }
        publish.single(
            "wattwatch/room-102/cv",
            json.dumps(payload),
            hostname="localhost",
            port=1883,
        )
        time.sleep(3)

        rooms = requests.get("http://localhost:8000/api/rooms", timeout=8).json()
        devices = requests.get("http://localhost:8000/api/devices", timeout=8).json()
        stats = requests.get("http://localhost:8000/api/energy/stats", timeout=8).json()

        room102 = next((r for r in rooms if r["id"] == "room-102"), None)
        light102 = next((d for d in devices if d["room_id"] == "room-102" and d["type"] == "light"), None)

        result = {
            "backend_health": True,
            "frontend_up": True,
            "webcam_ok": webcam_ok,
            "webcam_error": webcam_error,
            "room_102_status": room102["status"] if room102 else None,
            "room_102_waste_detected": room102["waste_detected"] if room102 else None,
            "room_102_light_state": light102["is_on"] if light102 else None,
            "energy_stats_has_rollups": bool(stats.get("weekly") or stats.get("monthly")),
        }
        print(json.dumps(result, indent=2))

    finally:
        for p in procs[::-1]:
            if p.poll() is None:
                p.terminate()
                try:
                    p.wait(timeout=8)
                except subprocess.TimeoutExpired:
                    p.kill()


if __name__ == "__main__":
    run()
