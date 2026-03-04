import express from "express";
import {
  getEnergyLogs,
  getEnergySavings,
  getEnergyStats,
} from "../services/state.service.js";
import { getCurrentRollups } from "../services/analytics.service.js";

const router = express.Router();

router.get("/logs", async (_req, res) => {
  const logs = await getEnergyLogs();
  res.json(logs);
});

router.get("/stats", async (_req, res) => {
  const stats = await getEnergyStats();
  const rollups = await getCurrentRollups();
  res.json({ ...stats, weekly: rollups.weekly, monthly: rollups.monthly });
});

router.get("/savings", async (_req, res) => {
  const savings = await getEnergySavings();
  const rollups = await getCurrentRollups();
  res.json({ ...savings, weekly: rollups.weekly, monthly: rollups.monthly });
});

export default router;
