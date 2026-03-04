import { DeviceModel } from "../models/device.model.js";
import { RoomModel } from "../models/room.model.js";

const defaultRooms = [
  {
    room_id: "room-101",
    name: "Lecture Hall A",
    location: "Block A, Floor 1",
    camera_source: "CCTV-01",
  },
  {
    room_id: "room-102",
    name: "Computer Lab B",
    location: "Block B, Floor 2",
    camera_source: "CCTV-02",
    config: { auto_shutoff: true },
  },
  {
    room_id: "room-103",
    name: "Seminar Room C",
    location: "Block A, Floor 3",
    camera_source: "CCTV-03",
  },
];

const defaultDevices = [
  {
    device_id: "d1",
    room_id: "room-101",
    name: "Ceiling Lights",
    type: "light",
    power_watts: 120,
    command_topic: "wattwatch/room-101/light/cmd",
  },
  {
    device_id: "d2",
    room_id: "room-101",
    name: "Projector",
    type: "projector",
    power_watts: 300,
    command_topic: "wattwatch/room-101/projector/cmd",
  },
  {
    device_id: "d3",
    room_id: "room-102",
    name: "Lab Monitors",
    type: "monitor",
    power_watts: 600,
    command_topic: "wattwatch/room-102/monitor/cmd",
  },
  {
    device_id: "d4",
    room_id: "room-102",
    name: "Projector",
    type: "projector",
    power_watts: 300,
    command_topic: "wattwatch/room-102/projector/cmd",
  },
  {
    device_id: "d5",
    room_id: "room-102",
    name: "Ceiling Lights",
    type: "light",
    power_watts: 120,
    command_topic: "wattwatch/room-102/light/cmd",
  },
  {
    device_id: "d6",
    room_id: "room-103",
    name: "Tube Lights",
    type: "light",
    power_watts: 80,
    command_topic: "wattwatch/room-103/light/cmd",
  },
];

export async function seedIfEmpty() {
  const roomCount = await RoomModel.countDocuments();
  if (roomCount === 0) {
    await RoomModel.insertMany(defaultRooms);
  }

  const deviceCount = await DeviceModel.countDocuments();
  if (deviceCount === 0) {
    await DeviceModel.insertMany(defaultDevices);
  }
}
