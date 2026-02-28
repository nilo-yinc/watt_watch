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
import { getAlerts, getDevices, getRooms } from "./services/state.service.js";
import { addClient, removeClient } from "./services/ws-hub.js";

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(
  cors({
    origin: env.corsOrigins.includes("*") ? true : env.corsOrigins,
    credentials: true,
  })
);

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.get("/api/alerts", async (_req, res) => {
  res.json(await getAlerts());
});
app.use("/api/rooms", roomsRouter);
app.use("/api/devices", devicesRouter);
app.use("/api/energy", energyRouter);

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
