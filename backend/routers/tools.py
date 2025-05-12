from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, List, Optional
import uuid

router = APIRouter(prefix="/tools", tags=["Tools"])

class Tool(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: Optional[str] = None
    endpoint: str
    config: Optional[dict] = None

# In-memory tool store
tools: Dict[str, Tool] = {}

@router.get("/", response_model=List[Tool])
def list_tools():
    return list(tools.values())

@router.post("/", response_model=Tool)
def register_tool(tool: Tool):
    if tool.id in tools:
        raise HTTPException(status_code=400, detail="Tool already exists")
    tools[tool.id] = tool
    return tool 
