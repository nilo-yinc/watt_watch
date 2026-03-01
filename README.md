<p align="center">
  <h1 align="center">Watt-Watch</h1>
  <p align="center"><strong>AI-Powered Campus Energy Surveillance Platform</strong></p>
  <p align="center">
    Privacy-first energy waste detection using Computer Vision, IoT, and Real-time Dashboards
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/YOLOv8-Ultralytics-FF6F00" alt="YOLOv8" />
  <img src="https://img.shields.io/badge/ESP32-IoT-E7352C?logo=espressif&logoColor=white" alt="ESP32" />
  <img src="https://img.shields.io/badge/MQTT-Protocol-660066?logo=eclipse-mosquitto&logoColor=white" alt="MQTT" />
</p>

---

## Overview

**Watt-Watch** is an intelligent energy surveillance system designed for educational campuses. It detects energy waste in real time by combining:

- **Computer Vision** (YOLOv8) to detect room occupancy and appliance status
- **IoT Hardware** (ESP32 + Relay modules) to control lights, fans, and other appliances
- **Real-time Dashboard** for campus-wide energy monitoring with privacy-preserving ghost feeds
- **Automated Rules Engine** that turns off appliances in unoccupied rooms

The system ensures **zero PII storage** by processing all video locally and applying face/body blur before any data leaves the device.

---

## Architecture

```
+-------------------+       MQTT / HTTP        +-------------------+
|  Computer Vision  | -----------------------> |     Backend       |
|  (Python + YOLO)  |   occupancy, appliance   |  (Node.js/Express)|
|                   |   waste alerts, ghost     |  + Embedded MQTT  |
|  - People detect  |   frames (base64)        |  + WebSocket Hub  |
|  - Face detect    |                          |  + MongoDB        |
|  - Appliance ROI  |                          +--------+----------+
|  - Privacy blur   |                                   |
+-------------------+                            WebSocket (live)
                                                        |
+-------------------+                          +--------v----------+
|   ESP32 / IoT     | <--- MQTT commands ---   |    Frontend       |
|                   |                          |  (React + Vite)   |
|  - Relay control  |                          |                   |
|  - Light ON/OFF   |   HTTP (direct/proxy)    |  - Dashboard      |
|  - Fan ON/OFF     | <----------------------- |  - Ghost View     |
|  - Status polling |                          |  - Room Monitor   |
+-------------------+                          |  - Manual Control |
                                               |  - Analytics      |
                                               +-------------------+
```

---

## Features

### Computer Vision Module
- **YOLOv8** person detection with configurable confidence threshold
- **Face detection** for improved occupancy accuracy
- **Appliance status inference** via brightness ROI analysis
- **Privacy-preserving ghost frames** with face/body blur
- **Waste detection engine** that flags appliances ON in empty rooms
- **Real-time metrics** - Precision, Recall, F1 Score, False Trigger Rate
- **FastAPI endpoints** (`/status`, `/metrics`) for remote consumption

### Frontend Dashboard
| Page | Description |
|------|-------------|
| **Dashboard** | Campus-wide energy overview with live stats |
| **Campus Overview** | Building-level monitoring with room cards |
| **Ghost View** | Privacy-blurred surveillance feed with IoT controls |
| **Rooms** | Individual room status and appliance details |
| **Heatmap** | Visual energy consumption heat map |
| **Manual Control** | Direct appliance ON/OFF with safety interlocks |
| **Analytics** | Energy usage trends and charts |
| **Alerts** | Real-time waste detection alerts |
| **Rules** | Automated rule configuration |
| **Devices** | Connected device management |
| **Privacy** | GDPR/CCPA compliance dashboard |
| **Audit Logs** | Timestamped action history |
| **Settings** | System configuration |

### IoT Hardware (ESP32)
- ESP32 with dual-relay module for Lights and Fan control
- HTTP REST endpoints: `/led/on`, `/led/off`, `/led/toggle`, `/fan/on`, `/fan/off`, `/fan/toggle`
- Status endpoint: `/status` returns `{ ledState, fanState }`
- MQTT subscription for automated commands from the backend
- Integrated into Ghost View and Manual Control pages via Vite proxy

### Backend
- **Express.js** REST API with WebSocket hub for real-time updates
- **Embedded MQTT broker** (Aedes) - no external broker required
- **CV data ingestion** endpoints (`/api/cv/data`, `/api/cv/ghost-frame`)
- **State management** for rooms, devices, and appliance status
- **MongoDB** for persistent storage

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 6, TailwindCSS, Framer Motion, Recharts, Lucide Icons |
| Backend | Node.js, Express, WebSocket (ws), Aedes MQTT Broker, MongoDB |
| Computer Vision | Python 3.12, OpenCV, Ultralytics YOLOv8, FastAPI, Uvicorn |
| IoT | ESP32, Arduino IDE, Relay Module, MQTT (paho-mqtt) |
| Infrastructure | Docker (Mosquitto), MQTT Protocol |

---

## Project Structure

```
watt_watch/
|-- frontend/                # React dashboard (Vite)
|   |-- src/
|   |   |-- pages/           # 16 page components
|   |   |-- components/      # Reusable UI components
|   |   |-- hooks/           # Custom hooks (useRooms, useESP32, etc.)
|   |   |-- context/         # React context (AppContext, WebSocket)
|   |   |-- services/        # API service layer
|   |   |-- data/            # Mock data for demo mode
|   |   +-- index.css         # Design system + CSS variables
|   +-- vite.config.js       # Vite config with ESP32 proxy
|
|-- backend/
|   |-- src/                  # Node.js backend (Express + WS + MQTT)
|   |   |-- server.js         # Main entry point
|   |   +-- services/         # MQTT, WebSocket, State services
|   +-- app/                  # FastAPI backend (Python, alternative)
|       +-- routes/           # CV ingest endpoints
|
|-- computer_vision/
|   |-- app/
|   |   |-- cv/               # Detection modules (people, face, appliance, privacy)
|   |   |-- api/              # FastAPI server (status, metrics)
|   |   |-- logic/            # Waste detection engine
|   |   |-- metrics/          # Precision/Recall evaluator
|   |   |-- mqtt/             # MQTT client
|   |   +-- config.py         # Camera and detection settings
|   |-- run.py                # Entry point (FastAPI + CV thread)
|   +-- requirements.txt
|
|-- iot/
|   +-- firmware/
|       |-- esp32_relay_controller.ino  # Arduino firmware
|       |-- main.py                     # MicroPython firmware
|       +-- simulated_relay.py          # Software relay simulator
|
|-- config/                   # Mosquitto MQTT broker config
|-- docs/                     # Documentation
|-- scripts/                  # Utility scripts
+-- docker-compose.yml        # Docker services (Mosquitto)
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **Python** >= 3.10
- **npm** or **yarn**
- **pip**
- **Arduino IDE** (for ESP32 firmware, optional)

### 1. Clone the Repository

```bash
git clone https://github.com/nilo-yinc/watt_watch.git
cd watt_watch
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
WATTWATCH_MQTT_HOST=localhost
WATTWATCH_MQTT_PORT=1883
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
```

### 3. Start Backend

```bash
cd backend
npm install
npm run dev
```

The backend starts on `http://localhost:8000` with an embedded MQTT broker.

### 4. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Dashboard available at `http://localhost:5173`.

### 5. Start Computer Vision (Optional)

```bash
cd computer_vision
pip install -r requirements.txt
python run.py
```

This starts the FastAPI server on port 8000 and opens the camera for detection.

API Endpoints:
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/status` | GET | Live detection data (people, faces, appliance, waste) |
| `/metrics` | GET | Model metrics (precision, recall, F1, false trigger rate) |

### 6. ESP32 Setup (Optional)

1. Flash `iot/firmware/esp32_relay_controller.ino` to your ESP32 using Arduino IDE
2. Connect relays to designated GPIO pins (see [`docs/iot-wiring.md`](docs/iot-wiring.md))
3. Update ESP32 IP in `frontend/src/hooks/useESP32.js` and `frontend/vite.config.js`
4. The ESP32 control panel appears automatically in Ghost View when "Test Room" is selected

### 7. MQTT Broker (Optional - Docker)

```bash
docker-compose up -d
```

> **Note:** The backend includes an embedded Aedes MQTT broker, so an external broker is only needed for production.

---

## API Reference

### Backend REST API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/rooms` | GET | List all rooms with status |
| `/api/rooms/:id` | GET | Room details |
| `/api/devices` | GET | List all devices |
| `/api/cv/data` | POST | Receive CV detection data |
| `/api/cv/ghost-frame` | POST | Receive privacy-blurred frame |

### ESP32 HTTP API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/status` | GET | `{ ledState: bool, fanState: bool }` |
| `/led/on` | GET | Turn lights ON |
| `/led/off` | GET | Turn lights OFF |
| `/led/toggle` | GET | Toggle lights |
| `/fan/on` | GET | Turn fan ON |
| `/fan/off` | GET | Turn fan OFF |
| `/fan/toggle` | GET | Toggle fan |

### WebSocket Events

The frontend connects to `ws://localhost:8000/ws` and receives:
- `cv-data` - Real-time detection updates
- `ghost-frame` - Privacy-blurred video frames (base64)
- `device-state` - Device status changes

---

## Privacy

Watt-Watch is designed with privacy as a core principle:

- **No raw video storage** - All frames processed locally, discarded after analysis
- **Face/body blur** - Ghost Mode applies blur before any transmission
- **No PII collection** - Only aggregate occupancy counts are stored
- **Audit logging** - All access and control actions are timestamped
- **Compliance** - Designed with GDPR and CCPA guidelines in mind

---

## Documentation

| Document | Description |
|----------|-------------|
| [`docs/setup-guide.md`](docs/setup-guide.md) | Detailed installation guide |
| [`docs/architecture.md`](docs/architecture.md) | System architecture details |
| [`docs/iot-wiring.md`](docs/iot-wiring.md) | ESP32 wiring and pin diagram |
| [`docs/api-reference.md`](docs/api-reference.md) | Full API documentation |

---

## Team

**Team #includeHackers**

Built for the Green Technology Hackathon.

---

## License

This project is developed for educational and hackathon purposes.
