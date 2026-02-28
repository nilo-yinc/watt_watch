"""
Central configuration file.
"""
import os

## Camera settings
CAMERA_SOURCE = int(os.getenv("WATTWATCH_CAMERA_SOURCE", "0"))

# CCTV-style resolution
FRAME_WIDTH = int(os.getenv("WATTWATCH_FRAME_WIDTH", "640"))
FRAME_HEIGHT = int(os.getenv("WATTWATCH_FRAME_HEIGHT", "480"))

# JPEG compression quality (0-100)
JPEG_QUALITY = int(os.getenv("WATTWATCH_JPEG_QUALITY", "50"))

## YOLO detection confidence threshold
CONFIDENCE_THRESHOLD = float(os.getenv("WATTWATCH_CONFIDENCE_THRESHOLD", "0.3"))

# Waste logic
WASTE_DELAY_SECONDS = int(os.getenv("WATTWATCH_WASTE_DELAY_SECONDS", "5"))
PRIVACY_MODE = os.getenv("WATTWATCH_PRIVACY_MODE", "blur")
ROOM_ID = os.getenv("WATTWATCH_ROOM_ID", "room-102")
MQTT_CV_TOPIC = os.getenv("WATTWATCH_CV_TOPIC", f"wattwatch/{ROOM_ID}/cv")
PUBLISH_INTERVAL_SECONDS = float(os.getenv("WATTWATCH_PUBLISH_INTERVAL_SECONDS", "2"))

# MQTT
MQTT_BROKER = os.getenv("WATTWATCH_MQTT_BROKER", "localhost")
MQTT_PORT = int(os.getenv("WATTWATCH_MQTT_PORT", "1883"))

# Ghost frame stream (YOLO + blur output for dashboard view)
ENABLE_GHOST_STREAM = os.getenv("WATTWATCH_ENABLE_GHOST_STREAM", "1") == "1"
GHOST_FRAME_TOPIC = os.getenv("WATTWATCH_GHOST_FRAME_TOPIC", f"wattwatch/{ROOM_ID}/ghost/frame")
GHOST_STREAM_INTERVAL_SECONDS = float(os.getenv("WATTWATCH_GHOST_STREAM_INTERVAL_SECONDS", "0.3"))
GHOST_STREAM_JPEG_QUALITY = int(os.getenv("WATTWATCH_GHOST_STREAM_JPEG_QUALITY", "45"))
