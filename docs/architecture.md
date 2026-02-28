# Watt-Watch Architecture

## Data Flow

1. CCTV feed enters `computer_vision/app/main.py`.
2. YOLO + brightness heuristic produce:
   - `person_count`
   - `appliance_on`
   - `waste_detected`
3. CV publishes JSON to MQTT: `wattwatch/<room_id>/cv`.
4. Backend MQTT service consumes event, updates room status, logs energy events, and broadcasts websocket updates.
5. Backend can publish relay commands to ESP32:
   - `wattwatch/<room_id>/light/cmd`
   - `wattwatch/<room_id>/projector/cmd`
   - `wattwatch/<room_id>/monitor/cmd`
6. Frontend receives live updates over `/ws` and pulls baseline state from REST APIs.

## Privacy

- CV applies blur mode (`WATTWATCH_PRIVACY_MODE=blur`) before visualization.
- Backend stores only metadata/events, not raw frames.

## Automation

- If room config `auto_shutoff=true`, backend sends `OFF` command to controllable devices when waste first triggers.
