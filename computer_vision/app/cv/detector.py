# app/cv/detector.py

"""
Person detection module using YOLOv8.
Why modular?
"""
from ultralytics import YOLO
from app.config import CONFIDENCE_THRESHOLD

# Load lightweight YOLO model (fast for real-time)
model = YOLO("yolov8n.pt")

def detect_people(frame):
    """
    Detect people in a frame.

    Returns:
        person_count (int)
        boxes (list of bounding boxes)
    """

    # Run YOLO inference
    results = model(frame, conf=CONFIDENCE_THRESHOLD)[0]

    person_count = 0
    boxes = []

    # Loop through detected objects
    for box in results.boxes:
        cls = int(box.cls[0])

        # Check if detected object is a person
        if model.names[cls] == "person":
            person_count += 1
            boxes.append(box.xyxy[0].tolist())

    return person_count, boxes