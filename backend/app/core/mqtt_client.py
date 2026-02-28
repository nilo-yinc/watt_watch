import logging
from typing import Callable

import paho.mqtt.client as mqtt


class BackendMQTTClient:
    def __init__(
        self,
        host: str,
        port: int,
        keepalive: int,
        subscriptions: list[str],
        on_message: Callable[[str, str], None],
    ) -> None:
        self._logger = logging.getLogger("wattwatch.mqtt")
        self._host = host
        self._port = port
        self._keepalive = keepalive
        self._subscriptions = subscriptions
        self._on_message_callback = on_message
        self._client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id="wattwatch-backend")
        self._client.on_connect = self._on_connect
        self._client.on_message = self._on_message
        self._running = False

    def start(self) -> None:
        if self._running:
            return
        self._client.connect(self._host, self._port, keepalive=self._keepalive)
        self._client.loop_start()
        self._running = True
        self._logger.info("MQTT connected to %s:%s", self._host, self._port)

    def stop(self) -> None:
        if not self._running:
            return
        self._client.loop_stop()
        self._client.disconnect()
        self._running = False
        self._logger.info("MQTT disconnected")

    def publish(self, topic: str, payload: str, retain: bool = False) -> None:
        self._client.publish(topic, payload, qos=0, retain=retain)
        self._logger.info("MQTT publish %s => %s", topic, payload)

    def _on_connect(self, client: mqtt.Client, *_args) -> None:
        for topic in self._subscriptions:
            client.subscribe(topic)
            self._logger.info("MQTT subscribed %s", topic)

    def _on_message(self, _client: mqtt.Client, _userdata, message: mqtt.MQTTMessage) -> None:
        try:
            payload = message.payload.decode("utf-8")
        except Exception:
            payload = ""
        self._on_message_callback(message.topic, payload)
