import dotenv from "dotenv";

dotenv.config();

const required = ["MONGODB_URI"];
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}

export const env = {
  port: Number(process.env.PORT || 8000),
  mongoUri: process.env.MONGODB_URI,
  mongoDbName: process.env.MONGODB_DB_NAME || "watt-watch",
  mqttBrokerUrl: process.env.MQTT_BROKER_URL || "mqtt://localhost:1883",
  mqttTopicCv: process.env.MQTT_TOPIC_CV || "wattwatch/+/cv",
  mqttTopicDeviceState:
    process.env.MQTT_TOPIC_DEVICE_STATE || "wattwatch/+/+/state",
  corsOrigins: (process.env.CORS_ORIGINS || "*")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};
