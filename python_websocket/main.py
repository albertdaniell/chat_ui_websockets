import asyncio
import websockets
import json

CONNECTIONS = set()

async def echo(websocket):
  if websocket not in CONNECTIONS:
    CONNECTIONS.add(websocket)
  async for message in websocket:
    msg_json = json.loads(message)
    print(msg_json)
    websockets.broadcast(CONNECTIONS,message)

async def main():
    async with websockets.serve(echo, "localhost", 8765):
        await asyncio.Future()  # run forever

asyncio.run(main())