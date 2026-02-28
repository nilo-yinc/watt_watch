const clients = new Set();

export function addClient(ws) {
  clients.add(ws);
}

export function removeClient(ws) {
  clients.delete(ws);
}

export function broadcast(payload) {
  const message = JSON.stringify(payload);
  for (const ws of clients) {
    if (ws.readyState === ws.OPEN) {
      ws.send(message);
    }
  }
}
