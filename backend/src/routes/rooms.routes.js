import express from "express";
import { getRoom, getRooms, updateRoomConfig } from "../services/state.service.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  const rooms = await getRooms();
  res.json(rooms);
});

router.get("/:roomId", async (req, res) => {
  const room = await getRoom(req.params.roomId);
  if (!room) return res.status(404).json({ detail: "Room not found" });
  return res.json(room);
});

router.put("/:roomId/config", async (req, res) => {
  const room = await updateRoomConfig(req.params.roomId, req.body || {});
  if (!room) return res.status(404).json({ detail: "Room not found" });
  return res.json(room);
});

export default router;
