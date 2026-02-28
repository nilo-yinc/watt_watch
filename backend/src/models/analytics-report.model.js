import mongoose from "mongoose";

const analyticsReportSchema = new mongoose.Schema(
  {
    period_type: { type: String, enum: ["weekly", "monthly"], required: true },
    period_key: { type: String, required: true, index: true },
    metrics: {
      cv_events: { type: Number, default: 0 },
      waste_events: { type: Number, default: 0 },
      waste_duration_s: { type: Number, default: 0 },
      energy_wasted_wh: { type: Number, default: 0 },
      estimated_cost_inr: { type: Number, default: 0 },
      auto_shutoff_events: { type: Number, default: 0 },
      devices_turned_off: { type: Number, default: 0 },
      estimated_co2_kg: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

analyticsReportSchema.index({ period_type: 1, period_key: 1 }, { unique: true });

export const AnalyticsReportModel = mongoose.model(
  "AnalyticsReport",
  analyticsReportSchema
);
