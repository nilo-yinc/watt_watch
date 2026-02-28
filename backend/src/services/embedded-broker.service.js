import net from "node:net";
import aedesFactory from "aedes";

let server = null;

export async function startEmbeddedBroker(port = 1883) {
  const aedes = aedesFactory();
  server = net.createServer(aedes.handle);

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, () => resolve());
  });

  console.log(`[mqtt-embedded] broker listening on port ${port}`);
}

export async function stopEmbeddedBroker() {
  if (!server) return;
  await new Promise((resolve) => server.close(() => resolve()));
  server = null;
}
