from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .judge0 import execute_code, CodeSubmission
from .sockets import sio_app
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/socket.io", sio_app)  # Mount Socket.IO under /socket.io

@app.post("/execute")
async def run_code(payload: CodeSubmission):
    result = await execute_code(payload)
    return result

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=6500, reload=True)
