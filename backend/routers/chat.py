from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import log appender if available
try:
    from .logs import append_log, LogEntry
except ImportError:
    append_log = None
    LogEntry = None

router = APIRouter(prefix="/chat", tags=["Chat"])

class ChatRequest(BaseModel):
    agent_id: str
    message: str

class ChatResponse(BaseModel):
    response: str

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

@router.post("/", response_model=ChatResponse)
async def chat_with_agent(req: ChatRequest):
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="Groq API key not configured")

    try:
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": "llama3-70b-8192",
            "messages": [
                {"role": "system", "content": "You are a helpful AI assistant."},
                {"role": "user", "content": req.message}
            ],
            "temperature": 0.7,
            "max_tokens": 1024
        }

        print(f"Making request to Groq API with data: {json.dumps(data)}")
        response = requests.post(GROQ_API_URL, headers=headers, json=data)
        
        if response.status_code != 200:
            print(f"Groq API error response: {response.text}")
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Groq API error: {response.text}"
            )
        
        result = response.json()
        print(f"Groq API response: {json.dumps(result)}")
        
        if "choices" not in result or not result["choices"]:
            raise HTTPException(
                status_code=500,
                detail="Invalid response format from Groq API"
            )
            
        ai_response = result["choices"][0]["message"]["content"]

        # Log the interaction
        if append_log and LogEntry:
            append_log(LogEntry(
                agent_id=req.agent_id,
                action="chat",
                output=ai_response
            ))

        return ChatResponse(response=ai_response)

    except requests.exceptions.RequestException as e:
        print(f"Request error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error calling Groq API: {str(e)}")
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}") 
        #abc
