import asyncio
import json
import logging
from concurrent.futures import Future

from app.core.config import settings
from app.core.mqtt_client import BackendMQTTClient
from app.services.runtime import state, ws_manager

logger = logging.getLogger("wattwatch.mqtt")
main_loop: asyncio.AbstractEventLoop | None = None


def set_event_loop(loop: asyncio.AbstractEventLoop) -> None:
    global main_loop
    main_loop = loop


def _dispatch(payload: dict) -> Future | None:
    if main_loop is None:
        return None
    return asyncio.run_coroutine_threadsafe(ws_manager.broadcast_json(payload), main_loop)


def _room_id_from_topic(topic: str) -> str | None:
    parts = topic.split("/")
    if len(parts) >= 3 and parts[0] == "wattwatch":
        return parts[1]
    return None


def _handle_device_telemetry(topic: str, payload: str) -> None:
    parts = topic.split("/")
    if len(parts) < 4:
        return
    room_id = parts[1]
    device_type = parts[2]
    state_str = payload.strip().upper()
    if state_str not in {"ON", "OFF"}:
        return
    changed = state.device_set_state_from_telemetry(room_id, device_type, state_str == "ON")
    if not changed:
        return

    for device in changed:
        _dispatch({"type": "device_update", "payload": device})

    room = state.get_room(room_id)
    if room:
        _dispatch({"type": "room_update", "payload": room})


def _handle_cv_payload(topic: str, payload: str) -> None:
    room_id = _room_id_from_topic(topic)
    if not room_id:
        return
    try:
        data = json.loads(payload) if payload else {}
    except json.JSONDecodeError:
        logger.warning("Invalid CV JSON payload on %s", topic)
        return

    updated_room, alert = state.update_room_from_cv(room_id, data)
    if not updated_room:
        return

    _dispatch({"type": "room_update", "payload": updated_room})

    if alert:
        _dispatch({"type": "alert", "payload": alert})

    if alert and updated_room.get("config", {}).get("auto_shutoff"):
        changed_devices = state.shutdown_room_controllable_devices(room_id)
        for device in changed_devices:
            mqtt_client.publish(device["command_topic"], "OFF")
            state.log_auto_shutoff(room_id, device["id"])
            _dispatch({"type": "device_update", "payload": device})


def _on_mqtt_message(topic: str, payload: str) -> None:
    try:
        if topic.endswith("/cv"):
            _handle_cv_payload(topic, payload)
        elif topic.endswith("/state"):
            _handle_device_telemetry(topic, payload)
    except Exception as exc:
        logger.exception("MQTT handler failed: %s", exc)


mqtt_client = BackendMQTTClient(
    host=settings.mqtt_host,
    port=settings.mqtt_port,
    keepalive=settings.mqtt_keepalive,
    subscriptions=[settings.mqtt_topic_cv, settings.mqtt_topic_device_state],
    on_message=_on_mqtt_message,
)


def start_mqtt() -> None:
    try:
        mqtt_client.start()
    except Exception as exc:
        logger.warning("MQTT start failed (%s). Backend will run without broker.", exc)


def stop_mqtt() -> None:
    mqtt_client.stop()
