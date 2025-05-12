from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List, Optional
import datetime

router = APIRouter(prefix="/logs", tags=["Logs"])

class LogEntry(BaseModel):
    timestamp: str = Field(default_factory=lambda: datetime.datetime.utcnow().isoformat())
    agent_id: Optional[str] = None
    tool_id: Optional[str] = None
    action: str
    output: Optional[str] = None

# In-memory log store
logs: List[LogEntry] = []

@router.get("/", response_model=List[LogEntry])
def list_logs():
    return logs[-100:][::-1]  # Return last 100 logs, most recent first

# Utility to append logs from other routers
def append_log(entry: LogEntry):
    logs.append(entry) 
