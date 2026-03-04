import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    room_id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    status: {
      type: String,
      enum: ["secure", "waste", "recently_vacated"],
      default: "secure",
    },
    person_count: { type: Number, default: 0 },
    camera_source: { type: String, default: "CCTV" },
    appliances: {
      projector: { type: Boolean, default: false },
      monitors: { type: Boolean, default: false },
      lights: { type: Boolean, default: false },
    },
    waste_detected: { type: Boolean, default: false },
    waste_duration: { type: Number, default: 0 },
    last_updated: { type: Number, default: () => Date.now() },
    config: {
      empty_timeout: { type: Number, default: 30 },
      waste_confirmation: { type: Number, default: 60 },
      confidence_threshold: { type: Number, default: 0.5 },
      process_fps: { type: Number, default: 1 },
      notification_email: { type: Boolean, default: true },
      notification_sms: { type: Boolean, default: false },
      auto_shutoff: { type: Boolean, default: false },
    },
    waste_started_at: { type: Number, default: null },
  },
  { timestamps: true }
);

export const RoomModel = mongoose.model("Room", roomSchema);
