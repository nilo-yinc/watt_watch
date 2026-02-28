# Watt-Watch

Watt-Watch is a privacy-first energy waste detection platform that combines:
- CCTV/computer-vision occupancy + appliance inference
- Backend automation and real-time dashboard updates
- ESP32 + relay IoT control via MQTT

## Architecture

1. `computer_vision` publishes room events to MQTT topic `wattwatch/<room_id>/cv`.
2. `backend` consumes MQTT, updates room/device state, sends websocket updates, and can auto-trigger relay OFF.
3. `frontend` shows live room status, alerts, and device controls via REST + websocket.
4. `iot` ESP32 subscribes to `wattwatch/<room_id>/<device>/cmd` and drives relay pins.

## Quick Start

1. Start MQTT broker (Mosquitto).
2. Run backend:
   - `cd backend`
   - `pip install -r requirements.txt`
   - `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
3. Run frontend:
   - `cd frontend`
   - `npm install`
   - `npm run dev`
4. Run computer vision:
   - `cd computer_vision`
   - `pip install -r requiremets.txt`
   - `python -m app.main`

Detailed setup and wiring are in [`docs/setup-guide.md`](docs/setup-guide.md) and [`docs/iot-wiring.md`](docs/iot-wiring.md).
