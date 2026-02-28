# app/mqtt/client.py
import json

import paho.mqtt.publish as publish

from app.config import MQTT_BROKER, MQTT_PORT


class MQTTClient:
    def __init__(self):
        self.last_messages = {}

    def _publish(self, topic, message):
        """Publish only when payload changes for a topic."""
        if self.last_messages.get(topic) == message:
            return
        publish.single(topic, message, hostname=MQTT_BROKER, port=MQTT_PORT)
        print(f"MQTT -> {topic}: {message}")
        self.last_messages[topic] = message

    def publish_json(self, topic, payload: dict):
        self._publish(topic, json.dumps(payload, separators=(",", ":")))

    def publish_command(self, topic, message):
        self._publish(topic, message)
