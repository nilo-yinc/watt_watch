# app/main.py
import cv2
import time
import os
import json
import base64
import queue
import threading
import urllib.request
import urllib.error
from app.cv.camera import get_camera
from app.cv.detector import detect_people
from app.cv.appliance import detect_appliance
from app.cv.privacy import blur_people
from app.logic.engine import WasteDetector
from app.mqtt.client import MQTTClient
from app.config import FRAME_WIDTH, FRAME_HEIGHT
from app.config import JPEG_QUALITY
from app.cv.face_detector import detect_faces
from app.metrics.evaluator import Evaluator 
from app.api.state import latest_state,latest_metrics

# Initialize logic engine with delay (seconds)
logic = WasteDetector(delay_seconds=5)
mqtt=MQTTClient()
evaluator=Evaluator()

NODE_API_URL = os.getenv("WW_NODE_API_URL", "https://watt-watch-node.onrender.com").rstrip("/")
DEFAULT_ROOM_IDS = "test-room,room-101,room-102,room-103,r1,r2,r3,r4,r5,r6,r7,r8,r9,r10,r11,r12"
ROOM_IDS_RAW = os.getenv("WW_ROOM_IDS", DEFAULT_ROOM_IDS)
PUSH_TO_NODE = os.getenv("WW_PUSH_TO_NODE", "1") == "1"
DATA_PUSH_INTERVAL_S = float(os.getenv("WW_DATA_PUSH_INTERVAL_S", "1.0"))
GHOST_PUSH_INTERVAL_S = float(os.getenv("WW_GHOST_PUSH_INTERVAL_S", "0.4"))
SHOW_WINDOW = os.getenv("WW_SHOW_WINDOW", "0") == "1"
POST_TIMEOUT_S = float(os.getenv("WW_POST_TIMEOUT_S", "3.0"))
SEND_QUEUE_MAX = int(os.getenv("WW_SEND_QUEUE_MAX", "400"))
STREAM_WIDTH = int(os.getenv("WW_STREAM_WIDTH", "512"))
STREAM_HEIGHT = int(os.getenv("WW_STREAM_HEIGHT", "384"))
STREAM_JPEG_QUALITY = int(os.getenv("WW_STREAM_JPEG_QUALITY", "35"))

_send_queue: "queue.Queue[tuple[str, dict]]" = queue.Queue(maxsize=SEND_QUEUE_MAX)


def _post_json(url: str, payload: dict, timeout: float = POST_TIMEOUT_S) -> bool:
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout):
            return True
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, OSError):
        return False
    except Exception:
        return False


def _enqueue_post(url: str, payload: dict) -> None:
    try:
        _send_queue.put_nowait((url, payload))
    except queue.Full:
        # Drop oldest frame/update under backpressure to keep CV loop realtime.
        try:
            _send_queue.get_nowait()
            _send_queue.put_nowait((url, payload))
        except queue.Empty:
            pass


def _sender_worker() -> None:
    while True:
        url, payload = _send_queue.get()
        try:
            try:
                _post_json(url, payload)
            except Exception:
                # Keep worker alive on unexpected network/runtime errors.
                pass
        finally:
            _send_queue.task_done()


for _i in range(3):
    threading.Thread(target=_sender_worker, daemon=True).start()


def _parse_room_ids(raw: str) -> list[str]:
    room_ids = [room_id.strip() for room_id in raw.split(",") if room_id.strip()]
    return room_ids or ["test-room"]

def draw_boxes(frame, boxes):
    """Draw bounding boxes around detected people."""
    for box in boxes:
        x1, y1, x2, y2 = map(int, box)
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)


def main():
    room_ids = _parse_room_ids(ROOM_IDS_RAW)
    primary_room_id = room_ids[0]
    cap = get_camera()
    prev_light_state = None
    prev_fan_state = None
    last_data_push = 0.0
    last_ghost_push = 0.0

    while True:
        ret, frame = cap.read()
        if not ret or frame is None:
            break
        start_time = time.time()
        frame = cv2.resize(frame, (FRAME_WIDTH, FRAME_HEIGHT))
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), JPEG_QUALITY]
        _, encimg = cv2.imencode('.jpg', frame, encode_param)
        frame = cv2.imdecode(encimg, 1)

        # Mirror view
        frame = cv2.flip(frame, 1)

        # ===== Detection =====
        person_count, boxes = detect_people(frame)
        appliance_on, brightness = detect_appliance(frame)
        face_count, face_boxes = detect_faces(frame)
        
        ## ====Occupancy Logic====
        occupied = (person_count > 0) or (face_count > 0)
        effective_person_count = 1 if occupied else 0    
        
        # ===== Privacy =====
        frame = blur_people(frame, boxes)

        # ===== Logic Engine =====
        waste_detected = logic.update(effective_person_count, appliance_on)
        latency = time.time() - start_time
        
        # ===== Auto Ground Truth for Real-Time Metrics =====
        # Define expected correct behavior
        ground_truth = 1 if (not occupied and appliance_on) else 0

        # Update evaluator every frame
        evaluator.update(ground_truth, int(waste_detected))

        # Compute metrics
        metrics = evaluator.compute()
        
        # Update shared state for API
        latest_state.update({
            "people": person_count,
            "faces": face_count,
            "occupied": occupied,
            "appliance_on": appliance_on,
            "waste_detected": waste_detected,
            "brightness": int(brightness),
            "latency": latency
        })

        latest_metrics.update({
            "precision": metrics["Precision"],
            "recall": metrics["Recall"],
            "f1_score": metrics["F1 Score"],
            "false_trigger_rate": metrics["False Trigger Rate"]
        })
        print(
            f"\rF1: {metrics['F1 Score']:.2f} | "
            f"Precision: {metrics['Precision']:.2f} | "
            f"Recall: {metrics['Recall']:.2f} | "
            f"False Trig: {metrics['False Trigger Rate']:.2f}",
            end=""
        )

        # ===== Device Control with State Tracking =====

        light_state = "OFF" if waste_detected else "ON"
        fan_state   = "OFF" if waste_detected else "ON"

        # Publish only when state changes
        if light_state != prev_light_state:
            mqtt.publish_command("wattwatch/room101/lights/cmd", light_state)
            prev_light_state = light_state

        if fan_state != prev_fan_state:
            mqtt.publish_command("wattwatch/room101/fan/cmd", fan_state)
            prev_fan_state = fan_state

        # Draw boxes
        draw_boxes(frame, boxes)

        # ===== Display Info =====
        cv2.putText(frame, f"People: {person_count}", (10, 35),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 255, 0), 3)

        cv2.putText(frame, f"Brightness: {int(brightness)}", (10, 75),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 255), 3)

        cv2.putText(frame, f"Appliance: {'ON' if appliance_on else 'OFF'}", (10, 115),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 255), 3)

        # Waste status
        status_text = "WASTE DETECTED" if waste_detected else "SECURE"
        status_color = (0, 0, 255) if waste_detected else (0, 255, 0)

        cv2.putText(frame, status_text, (10, 165),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.1, status_color, 3)

        cv2.putText(frame, f"Latency: {latency:.2f}s", (10, 265),
            cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 255), 3)

        # Push live CV data + blurred ghost frame to the deployed Node backend.
        # This is required for Ghost View to show YOLO stream in the frontend.
        if PUSH_TO_NODE:
            now = time.time()

            if now - last_data_push >= DATA_PUSH_INTERVAL_S:
                data_payload = {
                    "room_id": primary_room_id,
                    "person_count": int(person_count),
                    "appliance_on": bool(appliance_on),
                    "waste_detected": bool(waste_detected),
                    "brightness": int(brightness),
                    "latency_ms": int(latency * 1000),
                    "privacy_mode": "blur",
                }
                _enqueue_post(f"{NODE_API_URL}/api/cv/data", data_payload)
                last_data_push = now

            if now - last_ghost_push >= GHOST_PUSH_INTERVAL_S:
                stream_frame = cv2.resize(frame, (STREAM_WIDTH, STREAM_HEIGHT))
                ok, ghost_buf = cv2.imencode(
                    ".jpg",
                    stream_frame,
                    [int(cv2.IMWRITE_JPEG_QUALITY), STREAM_JPEG_QUALITY],
                )
                if ok:
                    frame_b64 = base64.b64encode(ghost_buf.tobytes()).decode("ascii")
                    ts_ms = int(time.time() * 1000)
                    for room_id in room_ids:
                        ghost_payload = {
                            "room_id": room_id,
                            "image_b64": frame_b64,
                            "timestamp": ts_ms,
                            "person_count": int(person_count),
                            "appliance_on": bool(appliance_on),
                            "waste_detected": bool(waste_detected),
                            "brightness": int(brightness),
                            "latency_ms": int(latency * 1000),
                        }
                        _enqueue_post(f"{NODE_API_URL}/api/cv/ghost-frame", ghost_payload)
                last_ghost_push = now

        if SHOW_WINDOW:
            cv2.imshow("Watt-Watch | Stage 4", frame)
            if cv2.waitKey(1) == 27:
                break

    cap.release()
    if SHOW_WINDOW:
        cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
