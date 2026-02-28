# Setup Guide

## 1. MQTT Broker (Mosquitto)

Install and run Mosquitto on port `1883`.

Quick test:
- Subscribe: `mosquitto_sub -h localhost -t "wattwatch/#" -v`
- Publish: `mosquitto_pub -h localhost -t "wattwatch/test/cv" -m "{\"waste_detected\":true}"`

## 2. Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Use `.env` with:

```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
```

## 4. Computer Vision

```bash
cd computer_vision
pip install -r requiremets.txt
python -m app.main
```

Optional CV env:

```env
WATTWATCH_ROOM_ID=room-102
WATTWATCH_CAMERA_SOURCE=0
WATTWATCH_MQTT_BROKER=localhost
WATTWATCH_MQTT_PORT=1883
WATTWATCH_WASTE_DELAY_SECONDS=5
```

## 5. ESP32

Flash [`iot/firmware/esp32_relay_controller.ino`](../iot/firmware/esp32_relay_controller.ino) and configure Wi-Fi + broker IP.
