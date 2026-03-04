import threading
import time
from copy import deepcopy


def now_ts() -> int:
    return int(time.time())


class AppState:
    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._rooms: dict[str, dict] = {
            "room-101": {
                "id": "room-101",
                "name": "Lecture Hall A",
                "location": "Block A, Floor 1",
                "status": "secure",
                "person_count": 0,
                "camera_source": "CCTV-01",
                "appliances": {"projector": False, "monitors": False, "lights": False},
                "waste_detected": False,
                "waste_duration": 0,
                "last_updated": now_ts(),
                "config": {
                    "empty_timeout": 30,
                    "waste_confirmation": 60,
                    "confidence_threshold": 0.5,
                    "process_fps": 1,
                    "notification_email": True,
                    "notification_sms": False,
                    "auto_shutoff": False,
                },
                "_waste_started_at": None,
            },
            "room-102": {
                "id": "room-102",
                "name": "Computer Lab B",
                "location": "Block B, Floor 2",
                "status": "secure",
                "person_count": 0,
                "camera_source": "CCTV-02",
                "appliances": {"projector": False, "monitors": False, "lights": False},
                "waste_detected": False,
                "waste_duration": 0,
                "last_updated": now_ts(),
                "config": {
                    "empty_timeout": 30,
                    "waste_confirmation": 60,
                    "confidence_threshold": 0.5,
                    "process_fps": 1,
                    "notification_email": True,
                    "notification_sms": False,
                    "auto_shutoff": True,
                },
                "_waste_started_at": None,
            },
            "room-103": {
                "id": "room-103",
                "name": "Seminar Room C",
                "location": "Block A, Floor 3",
                "status": "secure",
                "person_count": 0,
                "camera_source": "CCTV-03",
                "appliances": {"projector": False, "monitors": False, "lights": False},
                "waste_detected": False,
                "waste_duration": 0,
                "last_updated": now_ts(),
                "config": {
                    "empty_timeout": 30,
                    "waste_confirmation": 60,
                    "confidence_threshold": 0.5,
                    "process_fps": 1,
                    "notification_email": True,
                    "notification_sms": False,
                    "auto_shutoff": False,
                },
                "_waste_started_at": None,
            },
        }

        self._devices: dict[str, dict] = {
            "d1": {
                "id": "d1",
                "room_id": "room-101",
                "name": "Ceiling Lights",
                "type": "light",
                "is_on": False,
                "power_watts": 120,
                "controllable": True,
                "command_topic": "wattwatch/room-101/light/cmd",
            },
            "d2": {
                "id": "d2",
                "room_id": "room-101",
                "name": "Projector",
                "type": "projector",
                "is_on": False,
                "power_watts": 300,
                "controllable": True,
                "command_topic": "wattwatch/room-101/projector/cmd",
            },
            "d3": {
                "id": "d3",
                "room_id": "room-102",
                "name": "Lab Monitors",
                "type": "monitor",
                "is_on": False,
                "power_watts": 600,
                "controllable": True,
                "command_topic": "wattwatch/room-102/monitor/cmd",
            },
            "d4": {
                "id": "d4",
                "room_id": "room-102",
                "name": "Projector",
                "type": "projector",
                "is_on": False,
                "power_watts": 300,
                "controllable": True,
                "command_topic": "wattwatch/room-102/projector/cmd",
            },
            "d5": {
                "id": "d5",
                "room_id": "room-102",
                "name": "Ceiling Lights",
                "type": "light",
                "is_on": False,
                "power_watts": 120,
                "controllable": True,
                "command_topic": "wattwatch/room-102/light/cmd",
            },
            "d6": {
                "id": "d6",
                "room_id": "room-103",
                "name": "Tube Lights",
                "type": "light",
                "is_on": False,
                "power_watts": 80,
                "controllable": True,
                "command_topic": "wattwatch/room-103/light/cmd",
            },
        }
        self._alerts: list[dict] = []
        self._energy_logs: list[dict] = []

    def _public_room(self, room: dict) -> dict:
        cleaned = deepcopy(room)
        cleaned.pop("_waste_started_at", None)
        return cleaned

    def get_rooms(self) -> list[dict]:
        with self._lock:
            return [self._public_room(room) for room in self._rooms.values()]

    def get_room(self, room_id: str) -> dict | None:
        with self._lock:
            room = self._rooms.get(room_id)
            return self._public_room(room) if room else None

    def get_devices(self) -> list[dict]:
        with self._lock:
            return [deepcopy(device) for device in self._devices.values()]

    def get_device(self, device_id: str) -> dict | None:
        with self._lock:
            device = self._devices.get(device_id)
            return deepcopy(device) if device else None

    def get_alerts(self, limit: int = 50) -> list[dict]:
        with self._lock:
            return deepcopy(self._alerts[:limit])

    def update_room_config(self, room_id: str, config_update: dict) -> dict | None:
        with self._lock:
            room = self._rooms.get(room_id)
            if not room:
                return None
            room["config"].update(config_update)
            room["last_updated"] = now_ts()
            return self._public_room(room)

    def toggle_device(self, device_id: str, source: str = "manual") -> dict | None:
        with self._lock:
            device = self._devices.get(device_id)
            if not device:
                return None
            if not device.get("controllable", False):
                return deepcopy(device)

            device["is_on"] = not device["is_on"]
            room = self._rooms.get(device["room_id"])
            if room:
                self._sync_room_appliances_locked(room["id"])
                room["last_updated"] = now_ts()

            self._energy_logs.insert(
                0,
                {
                    "timestamp": now_ts(),
                    "event": "device_toggle",
                    "source": source,
                    "device_id": device_id,
                    "room_id": device["room_id"],
                    "state": "ON" if device["is_on"] else "OFF",
                },
            )
            self._energy_logs = self._energy_logs[:500]
            return deepcopy(device)

    def device_set_state_from_telemetry(self, room_id: str, device_type: str, is_on: bool) -> list[dict]:
        with self._lock:
            changed: list[dict] = []
            for device in self._devices.values():
                if device["room_id"] == room_id and device["type"] == device_type:
                    if device["is_on"] != is_on:
                        device["is_on"] = is_on
                        changed.append(deepcopy(device))
            if changed and room_id in self._rooms:
                self._sync_room_appliances_locked(room_id)
                self._rooms[room_id]["last_updated"] = now_ts()
            return changed

    def shutdown_room_controllable_devices(self, room_id: str) -> list[dict]:
        with self._lock:
            changed: list[dict] = []
            for device in self._devices.values():
                if device["room_id"] == room_id and device["controllable"] and device["is_on"]:
                    device["is_on"] = False
                    changed.append(deepcopy(device))
            if changed and room_id in self._rooms:
                self._sync_room_appliances_locked(room_id)
                self._rooms[room_id]["last_updated"] = now_ts()
            return changed

    def _sync_room_appliances_locked(self, room_id: str) -> None:
        room = self._rooms.get(room_id)
        if not room:
            return

        room_devices = [d for d in self._devices.values() if d["room_id"] == room_id and d["is_on"]]
        room["appliances"] = {
            "projector": any(d["type"] == "projector" for d in room_devices),
            "monitors": any(d["type"] == "monitor" for d in room_devices),
            "lights": any(d["type"] == "light" for d in room_devices),
        }

    def update_room_from_cv(self, room_id: str, payload: dict) -> tuple[dict | None, dict | None]:
        with self._lock:
            room = self._rooms.get(room_id)
            if not room:
                return None, None

            person_count = int(payload.get("person_count", room["person_count"]))
            appliance_on = bool(payload.get("appliance_on", False))
            waste_detected = bool(payload.get("waste_detected", False))
            brightness = float(payload.get("brightness", 0))
            latency_ms = int(payload.get("latency_ms", 0))
            privacy_mode = payload.get("privacy_mode", "blur")
            ts = now_ts()

            room["person_count"] = person_count
            room["appliances"]["lights"] = appliance_on or room["appliances"]["lights"]
            room["last_updated"] = ts

            if person_count > 0:
                room["status"] = "secure"
            elif waste_detected:
                room["status"] = "waste"
            else:
                room["status"] = "recently_vacated"

            previous_waste = room["waste_detected"]
            alert: dict | None = None

            if waste_detected:
                if room["_waste_started_at"] is None:
                    room["_waste_started_at"] = ts
                room["waste_duration"] = ts - int(room["_waste_started_at"])
            else:
                room["_waste_started_at"] = None
                room["waste_duration"] = 0

            room["waste_detected"] = waste_detected

            self._energy_logs.insert(
                0,
                {
                    "timestamp": ts,
                    "event": "cv_update",
                    "room_id": room_id,
                    "person_count": person_count,
                    "appliance_on": appliance_on,
                    "waste_detected": waste_detected,
                    "brightness": brightness,
                    "latency_ms": latency_ms,
                    "privacy_mode": privacy_mode,
                },
            )
            self._energy_logs = self._energy_logs[:500]

            if waste_detected and not previous_waste:
                alert = {
                    "id": f"alert-{ts}-{room_id}",
                    "room_id": room_id,
                    "room_name": room["name"],
                    "message": (
                        f"Energy waste detected: room empty with active load "
                        f"({latency_ms} ms inference)"
                    ),
                    "severity": "high",
                    "timestamp": ts * 1000,
                }
                self._alerts.insert(0, deepcopy(alert))
                self._alerts = self._alerts[:200]

            return self._public_room(room), alert

    def energy_logs(self, limit: int = 200) -> list[dict]:
        with self._lock:
            return deepcopy(self._energy_logs[:limit])

    def energy_stats(self) -> dict:
        with self._lock:
            active_power_w = sum(d["power_watts"] for d in self._devices.values() if d["is_on"])
            waste_rooms = [r for r in self._rooms.values() if r["waste_detected"]]
            waste_power_w = sum(
                d["power_watts"]
                for d in self._devices.values()
                if d["is_on"] and any(r["id"] == d["room_id"] for r in waste_rooms)
            )
            waste_seconds = sum(r["waste_duration"] for r in waste_rooms)

        energy_wasted_wh = (waste_power_w * waste_seconds) / 3600
        return {
            "active_power_w": active_power_w,
            "waste_power_w": waste_power_w,
            "waste_room_count": len(waste_rooms),
            "waste_duration_s": waste_seconds,
            "energy_wasted_wh": round(energy_wasted_wh, 2),
            "estimated_cost_inr": round((energy_wasted_wh / 1000) * 8, 2),
        }

    def energy_savings(self) -> dict:
        with self._lock:
            automated_cuts = len(
                [log for log in self._energy_logs if log.get("event") == "auto_shutoff"]
            )
            total_device_off_events = len(
                [log for log in self._energy_logs if log.get("event") == "device_toggle" and log.get("state") == "OFF"]
            )

        estimated_saved_wh = automated_cuts * 150.0
        return {
            "auto_shutoff_events": automated_cuts,
            "manual_or_auto_off_events": total_device_off_events,
            "estimated_saved_wh": estimated_saved_wh,
            "estimated_saved_kwh": round(estimated_saved_wh / 1000, 3),
            "estimated_saved_inr": round((estimated_saved_wh / 1000) * 8, 2),
            "estimated_co2_kg": round((estimated_saved_wh / 1000) * 0.82, 3),
        }

    def log_auto_shutoff(self, room_id: str, device_id: str) -> None:
        with self._lock:
            self._energy_logs.insert(
                0,
                {
                    "timestamp": now_ts(),
                    "event": "auto_shutoff",
                    "room_id": room_id,
                    "device_id": device_id,
                },
            )
            self._energy_logs = self._energy_logs[:500]
