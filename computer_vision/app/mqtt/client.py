# app/mqtt/client.py
import json
import paho.mqtt.publish as publish
from app.config import MQTT_BROKER, MQTT_PORT


class MQTTClient:
    def __init__(self):
        # Track last message per topic to prevent spam
        self.last_messages = {}

    def _publish(self, topic, message):
        """Internal publish with duplicate filtering."""
        if self.last_messages.get(topic) != message:
            publish.single(topic, message, hostname=MQTT_BROKER, port=MQTT_PORT)
            try:
                print(f"MQTT -> {topic}: {message}")
            except OSError:
                pass
            self.last_messages[topic] = message

    def publish_waste(self, room, state):
        """Publish waste status (for dashboard)."""
        topic = f"wattwatch/{room}/waste"
        message = "ON" if state else "OFF"
        self._publish(topic, message)

    def publish_command(self, topic, message):
        """Publish device command (for ESP)."""
        self._publish(topic, message)

    def publish_json(self, topic, payload):
        """Publish JSON payload."""
        self._publish(topic, json.dumps(payload, separators=(",", ":")))
