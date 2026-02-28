# ESP32 + Relay Wiring

## Components

- ESP32 DevKit
- 1-channel or 4-channel 5V relay module
- External load (lamp/bulb for demo)
- Optional PIR motion sensor (for non-CCTV rooms)

## Basic Relay Wiring

1. ESP32 `GND` -> Relay `GND`
2. ESP32 `5V`/`VIN` -> Relay `VCC` (check module requirements)
3. ESP32 `GPIO26` -> Relay `IN1`
4. AC live wire through relay `COM` and `NO` terminals.

## MQTT Topics Used

- Command from backend to ESP32:
  - `wattwatch/room-102/light/cmd`
  - payload: `ON` or `OFF`
- Optional ESP32 state publish:
  - `wattwatch/room-102/light/state`
  - payload: `ON` or `OFF`

## Safety

- Do not handle mains wiring while powered.
- Prefer low-voltage lamp demo during development.
- Use opto-isolated relay board where possible.
