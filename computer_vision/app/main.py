# app/main.py
import cv2
import time
import base64
from app.cv.camera import get_camera
from app.cv.detector import detect_people
from app.cv.appliance import detect_appliance
from app.cv.privacy import blur_people
from app.logic.engine import WasteDetector
from app.mqtt.client import MQTTClient
from app.config import (
    FRAME_WIDTH,
    FRAME_HEIGHT,
    JPEG_QUALITY,
    MQTT_CV_TOPIC,
    PRIVACY_MODE,
    PUBLISH_INTERVAL_SECONDS,
    ROOM_ID,
    WASTE_DELAY_SECONDS,
    ENABLE_GHOST_STREAM,
    GHOST_FRAME_TOPIC,
    GHOST_STREAM_INTERVAL_SECONDS,
    GHOST_STREAM_JPEG_QUALITY,
)
from app.metrics.evaluator import Evaluator

# Initialize logic engine with delay (seconds)
logic = WasteDetector(delay_seconds=WASTE_DELAY_SECONDS)
mqtt = MQTTClient()
evaluator = Evaluator()

def draw_boxes(frame, boxes):
    """Draw bounding boxes around detected people."""
    for box in boxes:
        x1, y1, x2, y2 = map(int, box)
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)


def main():
    cap = get_camera()
    last_publish_ts = 0.0
    last_ghost_publish_ts = 0.0
    last_signature = None

    while True:
        ret, frame = cap.read()
        start_time = time.time()
        if not ret:
            break

        frame = cv2.resize(frame, (FRAME_WIDTH, FRAME_HEIGHT))
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), JPEG_QUALITY]
        _, encimg = cv2.imencode(".jpg", frame, encode_param)
        frame = cv2.imdecode(encimg, 1)

        # Mirror view
        frame = cv2.flip(frame, 1)

        # ===== Detection =====
        person_count, boxes = detect_people(frame)
        appliance_on, brightness = detect_appliance(frame)

        # ===== Privacy =====
        # `ghost_frame` is sent to dashboard: blur-only privacy frame (no debug overlays).
        ghost_frame = frame.copy()
        # `display_frame` is local debug window frame (may include boxes/text).
        display_frame = frame.copy()
        if PRIVACY_MODE == "blur":
            ghost_frame = blur_people(ghost_frame, boxes)
            display_frame = blur_people(display_frame, boxes)

        # ===== Logic Engine =====
        waste_detected = logic.update(person_count, appliance_on)
        latency = time.time() - start_time

        # Temporary manual ground truth input
        key = cv2.waitKey(1) & 0xFF

        # Press W = waste scenario
        # Press S = secure scenario
        ground_truth = None

        if key == ord('w'): 
            ground_truth = 1
        elif key == ord('s'):
            ground_truth = 0

        if ground_truth is not None:
            evaluator.update(ground_truth, int(waste_detected))
        print("Metrics:", evaluator.compute())

        payload = {
            "timestamp": int(time.time()),
            "room_id": ROOM_ID,
            "person_count": person_count,
            "appliance_on": bool(appliance_on),
            "brightness": round(float(brightness), 2),
            "waste_detected": bool(waste_detected),
            "latency_ms": int(latency * 1000),
            "privacy_mode": PRIVACY_MODE,
        }
        signature = (payload["person_count"], payload["appliance_on"], payload["waste_detected"])
        now = time.time()
        if signature != last_signature or (now - last_publish_ts) >= PUBLISH_INTERVAL_SECONDS:
            mqtt.publish_json(MQTT_CV_TOPIC, payload)
            last_publish_ts = now
            last_signature = signature

        # Draw boxes
        draw_boxes(display_frame, boxes)

        # ===== Display Info =====
        cv2.putText(display_frame, f"People: {person_count}", (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0,255,0), 2)

        cv2.putText(display_frame, f"Brightness: {int(brightness)}", (10, 60),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255,255,255), 2)

        cv2.putText(display_frame, f"Appliance: {'ON' if appliance_on else 'OFF'}", (10, 90),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255,255,255), 2)
        
        cv2.putText(display_frame, f"Latency: {latency:.2f}s", (10, 220),
            cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0,255,255), 2)

        # Waste status
        status_text = "WASTE DETECTED" if waste_detected else "SECURE"
        status_color = (0, 0, 255) if waste_detected else (0, 255, 0)

        cv2.putText(display_frame, status_text, (10, 130),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.9, status_color, 2)

        if ENABLE_GHOST_STREAM and (time.time() - last_ghost_publish_ts) >= GHOST_STREAM_INTERVAL_SECONDS:
            ghost_param = [int(cv2.IMWRITE_JPEG_QUALITY), GHOST_STREAM_JPEG_QUALITY]
            ok_enc, ghost_jpg = cv2.imencode(".jpg", ghost_frame, ghost_param)
            if ok_enc:
                mqtt.publish_json(
                    GHOST_FRAME_TOPIC,
                    {
                        "room_id": ROOM_ID,
                        "timestamp": int(time.time()),
                        "image_b64": base64.b64encode(ghost_jpg.tobytes()).decode("ascii"),
                    },
                )
            last_ghost_publish_ts = time.time()

        cv2.imshow("Watt-Watch | Stage 4", display_frame)

        if cv2.waitKey(1) == 27:
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
