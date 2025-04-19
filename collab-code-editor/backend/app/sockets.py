import socketio
from .judge0 import execute_code, CodeSubmission

sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")
sio_app = socketio.ASGIApp(sio)

rooms = {}  # room_code: [usernames]
user_sid_map = {}  # sid: { "room": str, "username": str }
room_code_map = {}  # room_code: current_code
room_stdin_map = {}  # room_code: current_stdin
room_language_map = {}  # room_code: current_language_id

@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")
    user = user_sid_map.get(sid)
    if user:
        room = user["room"]
        if sid in rooms.get(room, []):
            rooms[room].remove(sid)
            await sio.emit("user_left", {"username": user["username"]}, room=room)
            if not rooms[room]:
                del rooms[room]  # clean up empty room
                del room_code_map[room]  # clean up room code
        del user_sid_map[sid]

@sio.event
async def join_room(sid, data):
    room = data["room"]
    username = data["username"]

    if room not in rooms:
        rooms[room] = []
        room_code_map[room] = "// Start coding..."  # Initialize room with default code
        room_stdin_map[room] = ""  # Initialize room with empty stdin
        room_language_map[room] = 43  # Default to "Plain Text" language

    # Check if the username already exists in the room
    if any(user_sid_map[s]["username"] == username for s in rooms[room]):
        await sio.emit(
            "room_joined",
            {
                "room": room,
                "username": username,
                "code": room_code_map[room],
                "stdin": room_stdin_map[room],
                "language_id": room_language_map[room],
            },
            to=sid,
        )
        print(f"{username} rejoined room {room}")
        return

    # Check if the room is full
    if len(rooms[room]) >= 2:
        await sio.emit("room_full", {"message": "Room is full."}, to=sid)
        print(f"Room {room} is full. {username} could not join.")
        return

    # Add user to the room
    rooms[room].append(sid)
    user_sid_map[sid] = {"room": room, "username": username}

    # Enter the room and emit events
    sio.enter_room(sid, room)
    await sio.emit(
        "room_joined",
        {
            "room": room,
            "username": username,
            "code": room_code_map[room],
            "stdin": room_stdin_map[room],
            "language_id": room_language_map[room],
        },
        to=sid,
    )
    await sio.emit("user_joined", {"username": username}, room=room)
    print(f"{username} joined room {room}")

@sio.event
async def code_change(sid, data):
    user = user_sid_map.get(sid)
    if user:
        room = user["room"]
        room_code_map[room] = data["code"]  # Update the room's current code
        await sio.emit("code_change", {"code": data["code"]}, room=room, skip_sid=sid)

@sio.event
async def cursor_change(sid, data):
    user = user_sid_map.get(sid)
    if user:
        room = user["room"]
        await sio.emit("cursor_update", data, room=room, skip_sid=sid)

@sio.event
async def execute_code_event(sid, data):
    user = user_sid_map.get(sid)
    if not user:
        return

    room = user["room"]
    code_submission = CodeSubmission(
        source_code=data["source_code"],
        language_id=data["language_id"],
        stdin=data.get("stdin", "")
    )

    result = await execute_code(code_submission)
    await sio.emit("executionResult", result, room=room)
    print(f"Code executed in room {room}, result sent to room members.")

@sio.event
async def stdin_change(sid, data):
    room = data["room"]
    stdin = data["stdin"]
    room_stdin_map[room] = stdin  # Update the room's current stdin
    await sio.emit("stdin_change", {"stdin": stdin}, room=room, skip_sid=sid)

@sio.event
async def language_change(sid, data):
    room = data["room"]
    language_id = data["language_id"]
    room_language_map[room] = language_id  # Update the room's current language
    await sio.emit("language_change", {"language_id": language_id}, room=room, skip_sid=sid)
