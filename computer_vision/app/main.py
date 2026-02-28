# app/main.py
import cv2
import time
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
        if PRIVACY_MODE == "blur":
            frame = blur_people(frame, boxes)

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
        draw_boxes(frame, boxes)

        # ===== Display Info =====
        cv2.putText(frame, f"People: {person_count}", (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0,255,0), 2)

        cv2.putText(frame, f"Brightness: {int(brightness)}", (10, 60),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255,255,255), 2)

        cv2.putText(frame, f"Appliance: {'ON' if appliance_on else 'OFF'}", (10, 90),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255,255,255), 2)
        
        cv2.putText(frame, f"Latency: {latency:.2f}s", (10, 220),
            cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0,255,255), 2)

        # Waste status
        status_text = "WASTE DETECTED" if waste_detected else "SECURE"
        status_color = (0, 0, 255) if waste_detected else (0, 255, 0)

        cv2.putText(frame, status_text, (10, 130),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.9, status_color, 2)

        cv2.imshow("Watt-Watch | Stage 4", frame)

        if cv2.waitKey(1) == 27:
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
