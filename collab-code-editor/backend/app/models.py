from pydantic import BaseModel

class JoinRoomData(BaseModel):
    room: str
    username: str

class CodeChange(BaseModel):
    room: str
    code: str

class CursorChange(BaseModel):
    room: str
    position: dict
