import mongoose from "mongoose";

const energyEventSchema = new mongoose.Schema(
  {
    event_type: {
      type: String,
      enum: ["cv_update", "device_toggle", "auto_shutoff", "device_state"],
      required: true,
      index: true,
    },
    room_id: { type: String, index: true },
    device_id: { type: String, index: true },
    payload: { type: mongoose.Schema.Types.Mixed, default: {} },
    timestamp: { type: Number, default: () => Math.floor(Date.now() / 1000), index: true },
  },
  { timestamps: true }
);

export const EnergyEventModel = mongoose.model("EnergyEvent", energyEventSchema);
