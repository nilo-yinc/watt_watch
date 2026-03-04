import net from "node:net";
import aedesFactory from "aedes";

const port = Number(process.env.MQTT_PORT || 1883);
const aedes = aedesFactory();
const server = net.createServer(aedes.handle);

server.listen(port, () => {
  console.log(`[local-mqtt] broker listening on 0.0.0.0:${port}`);
});

aedes.on("publish", (packet, client) => {
  if (!client) return;
  const payload = packet.payload ? packet.payload.toString("utf-8") : "";
  console.log(`[local-mqtt] ${client.id} -> ${packet.topic}: ${payload}`);
});

process.on("SIGINT", () => {
  server.close(() => process.exit(0));
});

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});
