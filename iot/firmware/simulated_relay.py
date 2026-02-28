import argparse
import signal
import sys

import paho.mqtt.client as mqtt


def main():
    parser = argparse.ArgumentParser(description="Simulate ESP32 relay over MQTT")
    parser.add_argument("--broker", default="localhost")
    parser.add_argument("--port", type=int, default=1883)
    parser.add_argument("--room", default="room-102")
    parser.add_argument("--device", default="light", choices=["light", "projector", "monitor"])
    args = parser.parse_args()

    command_topic = f"wattwatch/{args.room}/{args.device}/cmd"
    state_topic = f"wattwatch/{args.room}/{args.device}/state"

    relay_on = False
    running = True

    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id=f"sim-relay-{args.room}-{args.device}")

    def on_connect(_client, _userdata, _flags, _reason_code, _properties):
        print(f"[sim-relay] connected, subscribing {command_topic}")
        _client.subscribe(command_topic)
        _client.publish(state_topic, "OFF", retain=True)

    def on_message(_client, _userdata, msg):
        nonlocal relay_on
        payload = msg.payload.decode("utf-8").strip().upper()
        if payload not in {"ON", "OFF"}:
            return
        relay_on = payload == "ON"
        print(f"[sim-relay] command {payload} on {msg.topic}")
        _client.publish(state_topic, "ON" if relay_on else "OFF", retain=True)

    def shutdown(*_args):
        nonlocal running
        running = False

    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)

    client.on_connect = on_connect
    client.on_message = on_message
    client.connect(args.broker, args.port, keepalive=60)
    client.loop_start()

    try:
        while running:
            signal.pause()
    except AttributeError:
        # Windows fallback where signal.pause may be unavailable.
        import time
        while running:
            time.sleep(0.5)
    finally:
        client.loop_stop()
        client.disconnect()
        print("[sim-relay] stopped")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"[sim-relay] failed: {exc}", file=sys.stderr)
        sys.exit(1)
