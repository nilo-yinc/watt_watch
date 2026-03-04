import { AlertModel } from "../models/alert.model.js";
import { DeviceModel } from "../models/device.model.js";
import { EnergyEventModel } from "../models/energy-event.model.js";
import { RoomModel } from "../models/room.model.js";
import { rollupAnalytics } from "./analytics.service.js";

function nowTs() {
  return Math.floor(Date.now() / 1000);
}

function toRoomPayload(room) {
  return {
    id: room.room_id,
    name: room.name,
    location: room.location,
    status: room.status,
    person_count: room.person_count,
    camera_source: room.camera_source,
    appliances: room.appliances,
    waste_detected: room.waste_detected,
    waste_duration: room.waste_duration,
    last_updated: room.last_updated,
    config: room.config,
  };
}

function toDevicePayload(device) {
  return {
    id: device.device_id,
    room_id: device.room_id,
    name: device.name,
    type: device.type,
    is_on: device.is_on,
    power_watts: device.power_watts,
    controllable: device.controllable,
    command_topic: device.command_topic,
  };
}

async function syncRoomAppliances(roomId) {
  const activeDevices = await DeviceModel.find({ room_id: roomId, is_on: true }).lean();
  const appliances = {
    projector: activeDevices.some((d) => d.type === "projector"),
    monitors: activeDevices.some((d) => d.type === "monitor"),
    lights: activeDevices.some((d) => d.type === "light"),
  };
  await RoomModel.updateOne({ room_id: roomId }, { $set: { appliances, last_updated: Date.now() } });
}

export async function getRooms() {
  const rooms = await RoomModel.find().lean();
  return rooms.map((room) => toRoomPayload(room));
}

export async function getRoom(roomId) {
  const room = await RoomModel.findOne({ room_id: roomId }).lean();
  return room ? toRoomPayload(room) : null;
}

export async function updateRoomConfig(roomId, configUpdate) {
  const current = await RoomModel.findOne({ room_id: roomId });
  if (!current) return null;
  current.config = { ...current.config, ...configUpdate };
  current.last_updated = Date.now();
  await current.save();
  const room = current.toObject();
  return room ? toRoomPayload(room) : null;
}

export async function getDevices() {
  const devices = await DeviceModel.find().lean();
  return devices.map((device) => toDevicePayload(device));
}

export async function getDevice(deviceId) {
  const device = await DeviceModel.findOne({ device_id: deviceId }).lean();
  return device ? toDevicePayload(device) : null;
}

export async function toggleDevice(deviceId, source = "api") {
  const current = await DeviceModel.findOne({ device_id: deviceId });
  if (!current) return null;
  if (!current.controllable) return toDevicePayload(current.toObject());

  current.is_on = !current.is_on;
  await current.save();
  await syncRoomAppliances(current.room_id);

  await EnergyEventModel.create({
    event_type: "device_toggle",
    room_id: current.room_id,
    device_id: current.device_id,
    payload: { state: current.is_on ? "ON" : "OFF", source },
    timestamp: nowTs(),
  });

  if (!current.is_on) {
    await rollupAnalytics({
      devices_turned_off: 1,
    });
  }

  return toDevicePayload(current.toObject());
}

export async function updateDeviceStateFromTelemetry(roomId, deviceType, state) {
  const isOn = state === "ON";
  const devices = await DeviceModel.find({ room_id: roomId, type: deviceType });
  if (!devices.length) return [];

  const changed = [];
  for (const device of devices) {
    if (device.is_on !== isOn) {
      device.is_on = isOn;
      await device.save();
      changed.push(toDevicePayload(device.toObject()));
      await EnergyEventModel.create({
        event_type: "device_state",
        room_id: roomId,
        device_id: device.device_id,
        payload: { state },
        timestamp: nowTs(),
      });
    }
  }

  if (changed.length) {
    await syncRoomAppliances(roomId);
  }
  return changed;
}

export async function updateFromCvPayload(roomId, payload) {
  const room = await RoomModel.findOne({ room_id: roomId });
  if (!room) return { room: null, alert: null };

  const ts = nowTs();
  const personCount = Number(payload.person_count || 0);
  const applianceOn = Boolean(payload.appliance_on);
  const wasteDetected = Boolean(payload.waste_detected);
  const brightness = Number(payload.brightness || 0);
  const latencyMs = Number(payload.latency_ms || 0);
  const privacyMode = payload.privacy_mode || "blur";

  room.person_count = personCount;
  if (personCount > 0) {
    room.status = "secure";
  } else if (wasteDetected) {
    room.status = "waste";
  } else {
    room.status = "recently_vacated";
  }

  room.appliances = {
    ...room.appliances,
    lights: applianceOn || room.appliances.lights,
  };

  const wasWaste = room.waste_detected;
  if (wasteDetected) {
    if (!room.waste_started_at) {
      room.waste_started_at = ts;
    }
    room.waste_duration = Math.max(0, ts - room.waste_started_at);
  } else {
    room.waste_started_at = null;
    room.waste_duration = 0;
  }

  room.waste_detected = wasteDetected;
  room.last_updated = Date.now();
  await room.save();

  await EnergyEventModel.create({
    event_type: "cv_update",
    room_id: roomId,
    payload: {
      person_count: personCount,
      appliance_on: applianceOn,
      waste_detected: wasteDetected,
      brightness,
      latency_ms: latencyMs,
      privacy_mode: privacyMode,
    },
    timestamp: ts,
  });

  const activeDevices = await DeviceModel.find({ room_id: roomId, is_on: true }).lean();
  const activePower = activeDevices.reduce((sum, d) => sum + (d.power_watts || 0), 0);
  const inc = {
    cv_events: 1,
    waste_duration_s: wasteDetected ? room.waste_duration : 0,
    energy_wasted_wh: wasteDetected ? (activePower * room.waste_duration) / 3600 : 0,
    estimated_cost_inr: wasteDetected ? ((activePower * room.waste_duration) / 3600 / 1000) * 8 : 0,
    estimated_co2_kg: wasteDetected ? ((activePower * room.waste_duration) / 3600 / 1000) * 0.82 : 0,
    waste_events: wasteDetected && !wasWaste ? 1 : 0,
  };
  await rollupAnalytics(inc);

  let alert = null;
  if (wasteDetected && !wasWaste) {
    alert = {
      id: `alert-${ts}-${roomId}`,
      room_id: roomId,
      room_name: room.name,
      message: `Energy waste detected: room empty with active load (${latencyMs} ms inference)`,
      severity: "high",
      timestamp: Date.now(),
    };
    await AlertModel.create({
      alert_id: alert.id,
      room_id: alert.room_id,
      room_name: alert.room_name,
      message: alert.message,
      severity: alert.severity,
      timestamp: alert.timestamp,
    });
  }

  return { room: toRoomPayload(room.toObject()), alert };
}

export async function getEnergyLogs(limit = 200) {
  const events = await EnergyEventModel.find().sort({ timestamp: -1 }).limit(limit).lean();
  return events.map((e) => ({
    timestamp: e.timestamp,
    event: e.event_type,
    room_id: e.room_id,
    device_id: e.device_id,
    ...e.payload,
  }));
}

export async function getEnergyStats() {
  const [devices, rooms] = await Promise.all([
    DeviceModel.find().lean(),
    RoomModel.find().lean(),
  ]);
  const activePowerW = devices.filter((d) => d.is_on).reduce((sum, d) => sum + d.power_watts, 0);
  const wasteRooms = rooms.filter((r) => r.waste_detected);
  const wastePowerW = devices
    .filter((d) => d.is_on && wasteRooms.some((r) => r.room_id === d.room_id))
    .reduce((sum, d) => sum + d.power_watts, 0);
  const wasteDurationS = wasteRooms.reduce((sum, r) => sum + (r.waste_duration || 0), 0);
  const energyWastedWh = (wastePowerW * wasteDurationS) / 3600;
  return {
    active_power_w: activePowerW,
    waste_power_w: wastePowerW,
    waste_room_count: wasteRooms.length,
    waste_duration_s: wasteDurationS,
    energy_wasted_wh: Number(energyWastedWh.toFixed(2)),
    estimated_cost_inr: Number(((energyWastedWh / 1000) * 8).toFixed(2)),
  };
}

export async function getEnergySavings() {
  const [autoShutoffCount, offCount] = await Promise.all([
    EnergyEventModel.countDocuments({ event_type: "auto_shutoff" }),
    EnergyEventModel.countDocuments({
      event_type: "device_toggle",
      "payload.state": "OFF",
    }),
  ]);
  const estimatedSavedWh = autoShutoffCount * 150;
  return {
    auto_shutoff_events: autoShutoffCount,
    manual_or_auto_off_events: offCount,
    estimated_saved_wh: estimatedSavedWh,
    estimated_saved_kwh: Number((estimatedSavedWh / 1000).toFixed(3)),
    estimated_saved_inr: Number(((estimatedSavedWh / 1000) * 8).toFixed(2)),
    estimated_co2_kg: Number(((estimatedSavedWh / 1000) * 0.82).toFixed(3)),
  };
}

export async function getAlerts(limit = 50) {
  const alerts = await AlertModel.find().sort({ timestamp: -1 }).limit(limit).lean();
  return alerts.map((a) => ({
    id: a.alert_id,
    room_id: a.room_id,
    room_name: a.room_name,
    message: a.message,
    severity: a.severity,
    timestamp: a.timestamp,
  }));
}

export async function autoShutoffRoom(roomId) {
  const devices = await DeviceModel.find({ room_id: roomId, controllable: true, is_on: true });
  for (const device of devices) {
    device.is_on = false;
    await device.save();
    await EnergyEventModel.create({
      event_type: "auto_shutoff",
      room_id: roomId,
      device_id: device.device_id,
      payload: { state: "OFF" },
      timestamp: nowTs(),
    });
  }
  await syncRoomAppliances(roomId);
  if (devices.length) {
    await rollupAnalytics({
      auto_shutoff_events: 1,
      devices_turned_off: devices.length,
    });
  }
  return devices.map((d) => toDevicePayload(d.toObject()));
}
