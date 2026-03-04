#include <WiFi.h>
#include <PubSubClient.h>

// Update these for your network/broker.
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASS = "YOUR_WIFI_PASSWORD";
const char* MQTT_HOST = "192.168.1.100";
const int MQTT_PORT = 1883;

const char* ROOM_ID = "room-102";
const int RELAY_PIN = 26;

String commandTopic = String("wattwatch/") + ROOM_ID + "/light/cmd";
String stateTopic = String("wattwatch/") + ROOM_ID + "/light/state";

WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);

void connectWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
}

void publishState(bool isOn) {
  mqttClient.publish(stateTopic.c_str(), isOn ? "ON" : "OFF", true);
}

void setRelay(bool isOn) {
  // Most relay boards are active LOW. Flip if your board is active HIGH.
  digitalWrite(RELAY_PIN, isOn ? LOW : HIGH);
  publishState(isOn);
}

void onMqttMessage(char* topic, byte* payload, unsigned int length) {
  String message = "";
  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  message.trim();
  message.toUpperCase();

  if (String(topic) == commandTopic) {
    if (message == "ON") {
      setRelay(true);
    } else if (message == "OFF") {
      setRelay(false);
    }
  }
}

void connectMQTT() {
  while (!mqttClient.connected()) {
    String clientId = "esp32-relay-" + String((uint32_t)ESP.getEfuseMac(), HEX);
    if (mqttClient.connect(clientId.c_str())) {
      mqttClient.subscribe(commandTopic.c_str());
      publishState(false);
    } else {
      delay(1000);
    }
  }
}

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH);  // relay OFF for active LOW board

  connectWiFi();
  mqttClient.setServer(MQTT_HOST, MQTT_PORT);
  mqttClient.setCallback(onMqttMessage);
}

void loop() {
  if (!mqttClient.connected()) {
    connectMQTT();
  }
  mqttClient.loop();
}
