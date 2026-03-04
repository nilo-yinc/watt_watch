import { AnalyticsReportModel } from "../models/analytics-report.model.js";

function getIsoWeekKey(date = new Date()) {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((target - yearStart) / 86400000) + 1) / 7);
  return `${target.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function getMonthKey(date = new Date()) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export async function rollupAnalytics(incrementMetrics = {}) {
  const now = new Date();
  const weeklyKey = getIsoWeekKey(now);
  const monthlyKey = getMonthKey(now);

  await Promise.all([
    AnalyticsReportModel.findOneAndUpdate(
      { period_type: "weekly", period_key: weeklyKey },
      { $inc: Object.fromEntries(Object.entries(incrementMetrics).map(([k, v]) => [`metrics.${k}`, v])) },
      { upsert: true, new: true }
    ),
    AnalyticsReportModel.findOneAndUpdate(
      { period_type: "monthly", period_key: monthlyKey },
      { $inc: Object.fromEntries(Object.entries(incrementMetrics).map(([k, v]) => [`metrics.${k}`, v])) },
      { upsert: true, new: true }
    ),
  ]);
}

export async function getCurrentRollups() {
  const weeklyKey = getIsoWeekKey(new Date());
  const monthlyKey = getMonthKey(new Date());
  const [weekly, monthly] = await Promise.all([
    AnalyticsReportModel.findOne({ period_type: "weekly", period_key: weeklyKey }).lean(),
    AnalyticsReportModel.findOne({ period_type: "monthly", period_key: monthlyKey }).lean(),
  ]);
  return { weekly, monthly };
}
