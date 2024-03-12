import asyncio
import websockets
import json

CONNECTIONS = set()

async def echo(websocket):
  if websocket not in CONNECTIONS:
    CONNECTIONS.add(websocket)
  async for message_object in websocket:
    msg_json = json.loads(message_object)
    print(msg_json)
    websockets.broadcast(CONNECTIONS,message_object)

async def main():
    async with websockets.serve(echo, "localhost", 8765):
        await asyncio.Future()  # run forever

asyncio.run(main())