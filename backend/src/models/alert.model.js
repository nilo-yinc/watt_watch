import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    alert_id: { type: String, required: true, unique: true, index: true },
    room_id: { type: String, required: true, index: true },
    room_name: { type: String, required: true },
    message: { type: String, required: true },
    severity: { type: String, default: "high" },
    timestamp: { type: Number, required: true },
  },
  { timestamps: true }
);

export const AlertModel = mongoose.model("Alert", alertSchema);
