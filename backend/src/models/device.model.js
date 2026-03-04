import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    device_id: { type: String, required: true, unique: true, index: true },
    room_id: { type: String, required: true, index: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    is_on: { type: Boolean, default: false },
    power_watts: { type: Number, default: 0 },
    controllable: { type: Boolean, default: true },
    command_topic: { type: String, required: true },
  },
  { timestamps: true }
);

export const DeviceModel = mongoose.model("Device", deviceSchema);
