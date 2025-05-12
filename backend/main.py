from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import agents, tools, chat, logs

app = FastAPI(title="AgentDock MCP Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agents.router)
app.include_router(tools.router)
app.include_router(chat.router)
app.include_router(logs.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to AgentDock MCP Server"}
