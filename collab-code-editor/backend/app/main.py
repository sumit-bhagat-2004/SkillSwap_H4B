from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from .judge0 import execute_code, CodeSubmission
from .sockets import sio_app
import socketio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/socket.io", sio_app)  # Mount Socket.IO under /ws instead of /

@app.post("/execute")
async def run_code(payload: CodeSubmission):
    result = await execute_code(payload)
    return result
