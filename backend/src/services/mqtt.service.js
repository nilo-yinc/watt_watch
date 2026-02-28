import mqtt from "mqtt";
import { env } from "../config/env.js";
import {
  autoShutoffRoom,
  getRoom,
  updateDeviceStateFromTelemetry,
  updateFromCvPayload,
} from "./state.service.js";
import { broadcast } from "./ws-hub.js";

let mqttClient = null;
let lastMqttError = "";

function parseTopic(topic) {
  const parts = topic.split("/");
  return {
    root: parts[0],
    roomId: parts[1],
    deviceType: parts[2],
    leaf: parts[3],
  };
}

export function publishMqtt(topic, payload) {
  if (!mqttClient || !mqttClient.connected) return;
  mqttClient.publish(topic, payload);
}

export function startMqtt() {
  mqttClient = mqtt.connect(env.mqttBrokerUrl);

  mqttClient.on("connect", () => {
    console.log(`[mqtt] connected to ${env.mqttBrokerUrl}`);
    mqttClient.subscribe(env.mqttTopicCv);
    mqttClient.subscribe(env.mqttTopicDeviceState);
    mqttClient.subscribe(env.mqttTopicGhostFrame);
  });

  mqttClient.on("message", async (topic, messageBuffer) => {
    try {
      const message = messageBuffer.toString("utf-8");
      const parsed = parseTopic(topic);
      if (topic.endsWith("/cv")) {
        const payload = JSON.parse(message || "{}");
        const { room, alert } = await updateFromCvPayload(parsed.roomId, payload);
        if (!room) return;
        broadcast({ type: "room_update", payload: room });
        if (alert) {
          broadcast({ type: "alert", payload: alert });
        }

        const roomEntity = await getRoom(parsed.roomId);
        if (alert && roomEntity?.config?.auto_shutoff) {
          const switched = await autoShutoffRoom(parsed.roomId);
          for (const device of switched) {
            publishMqtt(device.command_topic, "OFF");
            broadcast({ type: "device_update", payload: device });
          }
          const updatedRoom = await getRoom(parsed.roomId);
          if (updatedRoom) {
            broadcast({ type: "room_update", payload: updatedRoom });
          }
        }
      } else if (topic.endsWith("/state")) {
        const state = message.trim().toUpperCase();
        if (!["ON", "OFF"].includes(state)) return;
        const changed = await updateDeviceStateFromTelemetry(
          parsed.roomId,
          parsed.deviceType,
          state
        );
        for (const device of changed) {
          broadcast({ type: "device_update", payload: device });
        }
        if (changed.length) {
          const room = await getRoom(parsed.roomId);
          if (room) broadcast({ type: "room_update", payload: room });
        }
      } else if (topic.endsWith("/ghost/frame")) {
        const payload = JSON.parse(message || "{}");
        if (!payload?.image_b64) return;
        broadcast({
          type: "ghost_frame",
          payload: {
            room_id: payload.room_id || parsed.roomId,
            timestamp: payload.timestamp || Date.now(),
            image_b64: payload.image_b64,
          },
        });
      }
    } catch (error) {
      console.error("[mqtt] message handling failed", error);
    }
  });

  mqttClient.on("error", (err) => {
    const msg = err?.message || "connection error";
    if (msg !== lastMqttError) {
      console.error("[mqtt] error", msg);
      lastMqttError = msg;
    }
  });
}

export function stopMqtt() {
  if (mqttClient) {
    mqttClient.end(true);
  }
}
