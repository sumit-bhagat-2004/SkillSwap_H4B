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
                del rooms[room]  # Clean up empty room
                del room_code_map[room]  # Clean up room code
        del user_sid_map[sid]
    for room_id, sids in rooms.items():
        if sid in sids:
            sids.remove(sid)
            await sio.emit("peer_list", {"peers": sids}, room=room_id)
            print(f"Client {sid} left video room {room_id}")
            break

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

# WebRTC signaling for video calls
@sio.event
async def offer(sid, data):
    room = user_sid_map.get(sid, {}).get("room", "unknown")
    sdp = data["sdp"]
    print(f"Offer received from {sid} in room {room}")  # Log the offer
    await sio.emit("offer", {"sdp": sdp, "sid": sid}, room=room, skip_sid=sid)  # Broadcast the offer

@sio.event
async def answer(sid, data):
    room = user_sid_map.get(sid, {}).get("room", "unknown")
    sdp = data["sdp"]
    print(f"Answer received from {sid} in room {room}")  # Log the answer
    await sio.emit("answer", {"sdp": sdp, "sid": sid}, room=room, skip_sid=sid)  # Broadcast the answer

@sio.event
async def ice_candidate(sid, data):
    room = user_sid_map.get(sid, {}).get("room", "unknown")
    candidate = data.get("candidate")
    if not candidate:
        print(f"ICE candidate missing from {sid} in room {room}")
        return
    print(f"ICE candidate received from {sid} in room {room}")  # Log the ICE candidate
    await sio.emit("ice_candidate", {"candidate": candidate, "sid": sid}, room=room, skip_sid=sid)  # Broadcast the ICE candidate

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

@sio.event
async def join_video_room(sid, data):
    room_id = data["roomId"]
    if room_id not in rooms:
        rooms[room_id] = []
    if sid not in rooms[room_id]:  # Prevent duplicate joins
        rooms[room_id].append(sid)
        user_sid_map[sid] = {"room": room_id}

    # Notify all users in the room about the updated peer list
    await sio.emit("peer_list", {"peers": rooms[room_id]}, room=room_id)
    sio.enter_room(sid, room_id)
    print(f"Client {sid} joined video room {room_id}")
