import httpx
from pydantic import BaseModel

# No need to load dotenv anymore
class CodeSubmission(BaseModel):
    source_code: str
    language_id: int
    stdin: str = ""

# Self-hosted Judge0 base URL (Docker default)
JUDGE0_URL = "http://localhost:2358/submissions"

HEADERS = {
    "Content-Type": "application/json"
}

async def execute_code(payload: CodeSubmission):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            JUDGE0_URL + "?base64_encoded=false&wait=true",
            json=payload.dict(),
            headers=HEADERS
        )
        return response.json()
