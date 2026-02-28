import express from "express";
import { publishMqtt } from "../services/mqtt.service.js";
import { getDevices, toggleDevice } from "../services/state.service.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  const devices = await getDevices();
  res.json(devices);
});

router.post("/:deviceId/toggle", async (req, res) => {
  const device = await toggleDevice(req.params.deviceId, "api");
  if (!device) return res.status(404).json({ detail: "Device not found" });
  publishMqtt(device.command_topic, device.is_on ? "ON" : "OFF");
  return res.json(device);
});

export default router;
