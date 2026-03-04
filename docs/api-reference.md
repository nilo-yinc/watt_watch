# API Reference

Base URL: `http://localhost:8000`

## Health

- `GET /health`

## Rooms

- `GET /api/rooms`
- `GET /api/rooms/{room_id}`
- `PUT /api/rooms/{room_id}/config`

Example config body:

```json
{
  "auto_shutoff": true,
  "waste_confirmation": 45,
  "confidence_threshold": 0.4
}
```

## Devices

- `GET /api/devices`
- `POST /api/devices/{device_id}/toggle`

## Energy

- `GET /api/energy/logs`
- `GET /api/energy/stats`
- `GET /api/energy/savings`

## Websocket

- `WS /ws`
- Message types:
  - `snapshot`
  - `room_update`
  - `device_update`
  - `alert`
