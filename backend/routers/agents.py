from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, List, Optional
import uuid

router = APIRouter(prefix="/agents", tags=["Agents"])

class Agent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    code: str
    description: Optional[str] = None
    config: Optional[dict] = None

# In-memory agent store
agents: Dict[str, Agent] = {}

@router.get("/", response_model=List[Agent])
def list_agents():
    return list(agents.values())

@router.post("/", response_model=Agent)
def register_agent(agent: Agent):
    if agent.id in agents:
        raise HTTPException(status_code=400, detail="Agent already exists")
    agents[agent.id] = agent
    return agent

@router.delete("/{agent_id}")
def deregister_agent(agent_id: str):
    if agent_id not in agents:
        raise HTTPException(status_code=404, detail="Agent not found")
    del agents[agent_id]
    return {"message": "Agent deregistered"} 
