import asyncio
import websockets
import json

async def receive_frames():
    uri = "wss://watt-watch-node.onrender.com/ws"
    async with websockets.connect(uri) as websocket:
        print("Connected")
        while True:
            try:
                message = await asyncio.wait_for(websocket.recv(), timeout=20.0)
                data = json.loads(message)
                if data.get("type") == "ghost_frame":
                    print(f"Got ghost_frame for {data.get('payload', {}).get('room_id')}")
            except asyncio.TimeoutError:
                print("No message in 20s")
            except Exception as e:
                print("Error:", e)
                break

asyncio.run(receive_frames())
