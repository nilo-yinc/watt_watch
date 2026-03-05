import http from "http";
import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";

import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import devicesRouter from "./routes/devices.routes.js";
import energyRouter from "./routes/energy.routes.js";
import roomsRouter from "./routes/rooms.routes.js";
import { startMqtt, stopMqtt } from "./services/mqtt.service.js";
import { startEmbeddedBroker, stopEmbeddedBroker } from "./services/embedded-broker.service.js";
import { seedIfEmpty } from "./services/seed.service.js";
import { getAlerts, getDevices, getRooms, updateFromCvPayload } from "./services/state.service.js";
import { addClient, removeClient, broadcast } from "./services/ws-hub.js";

const app = express();
app.use(express.json({ limit: "5mb" }));

function isAllowedOrigin(origin) {
  if (!origin) return true; // non-browser / same-origin requests

  const allowList = env.corsOrigins || [];
  if (allowList.includes("*")) return true;
  if (allowList.includes(origin)) return true;

  // Always allow Vercel deploy domains unless explicitly locked down.
  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) return true;

  return false;
}

const corsOptions = {
  origin(origin, callback) {
    callback(null, isAllowedOrigin(origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(
  cors(corsOptions)
);
app.options("*", cors(corsOptions));

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.get("/api/alerts", async (_req, res) => {
  res.json(await getAlerts());
});
app.use("/api/rooms", roomsRouter);
app.use("/api/devices", devicesRouter);
app.use("/api/energy", energyRouter);

// ── CV ingest endpoints (HTTP POST alternative to MQTT) ──────────
app.post("/api/cv/data", async (req, res) => {
  try {
    const payload = req.body;
    if (!payload?.room_id) return res.status(400).json({ error: "room_id required" });
    const { room, alert } = await updateFromCvPayload(payload.room_id, payload);
    if (room) broadcast({ type: "room_update", payload: room });
    if (alert) broadcast({ type: "alert", payload: alert });
    res.json({ ok: true });
  } catch (err) {
    console.error("[cv-http] data error", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/cv/ghost-frame", (req, res) => {
  try {
    const { room_id, image_b64, timestamp } = req.body;
    if (!room_id || !image_b64) return res.status(400).json({ error: "room_id and image_b64 required" });
    broadcast({
      type: "ghost_frame",
      payload: { room_id, image_b64, timestamp: timestamp || Date.now() },
    });
    res.json({ ok: true });
  } catch (err) {
    console.error("[cv-http] ghost-frame error", err);
    res.status(500).json({ error: err.message });
  }
});

const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

wss.on("connection", async (ws) => {
  addClient(ws);
  const [rooms, devices] = await Promise.all([getRooms(), getDevices()]);
  ws.send(JSON.stringify({ type: "snapshot", payload: { rooms, devices } }));
  ws.on("close", () => removeClient(ws));
  ws.on("error", () => removeClient(ws));
  ws.on("message", () => {
    // reserved for heartbeat / future commands
  });
});

server.on("upgrade", (req, socket, head) => {
  if (req.url === "/ws") {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
    return;
  }
  socket.destroy();
});

async function start() {
  await connectDb();
  await seedIfEmpty();
  if (env.embedMqttBroker) {
    try {
      await startEmbeddedBroker(env.embedMqttPort);
    } catch (error) {
      console.warn(`[mqtt-embedded] not started: ${error.message}`);
    }
  }
  startMqtt();
  server.listen(env.port, () => {
    console.log(`[api] express server running on http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start backend", error);
  process.exit(1);
});

process.on("SIGINT", () => {
  stopMqtt();
  stopEmbeddedBroker();
  process.exit(0);
});

process.on("SIGTERM", () => {
  stopMqtt();
  stopEmbeddedBroker();
  process.exit(0);
});
