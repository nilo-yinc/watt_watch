# app/main.py
import cv2
from app.cv.camera import get_camera
from app.cv.detector import detect_people
from app.cv.appliance import detect_appliance
from app.cv.privacy import blur_people
from app.logic.engine import WasteDetector

# Initialize logic engine with delay (seconds)
logic = WasteDetector(delay_seconds=5)


def draw_boxes(frame, boxes):
    """Draw bounding boxes around detected people."""
    for box in boxes:
        x1, y1, x2, y2 = map(int, box)
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)


def main():
    cap = get_camera()

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Mirror view
        frame = cv2.flip(frame, 1)

        # ===== Detection =====
        person_count, boxes = detect_people(frame)
        appliance_on, brightness = detect_appliance(frame)

        # ===== Privacy =====
        frame = blur_people(frame, boxes)

        # ===== Logic Engine =====
        waste_detected = logic.update(person_count, appliance_on)

        # Draw boxes
        draw_boxes(frame, boxes)

        # ===== Display Info =====
        cv2.putText(frame, f"People: {person_count}", (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0,255,0), 2)

        cv2.putText(frame, f"Brightness: {int(brightness)}", (10, 60),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255,255,255), 2)

        cv2.putText(frame, f"Appliance: {'ON' if appliance_on else 'OFF'}", (10, 90),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255,255,255), 2)

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