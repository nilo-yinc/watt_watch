const WebSocket = require('ws');
const ws = new WebSocket('wss://watt-watch-node.onrender.com/ws');

ws.on('open', () => {
    console.log('Connected to WebSocket');
});

ws.on('message', (data) => {
    const msg = JSON.parse(data);
    if (msg.type === 'ghost_frame') {
        console.log(`Received ghost frame for room ${msg.payload.room_id} at ${msg.payload.timestamp}`);
        console.log(`Contains metadata: person_count=${msg.payload.person_count}, brightness=${msg.payload.brightness}`);
    } else {
        console.log(`Received ${msg.type}`);
    }
});

ws.on('error', (err) => {
    console.error('WebSocket error:', err);
});

ws.on('close', () => {
    console.log('WebSocket closed');
});
