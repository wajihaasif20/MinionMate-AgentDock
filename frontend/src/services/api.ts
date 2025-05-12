const API_BASE = 'http://localhost:8000';

async function handleResponse(res: Response) {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Unknown error occurred' }));
    throw new Error(error.detail || `HTTP error! status: ${res.status}`);
  }
  return res.json();
}

// Agents
export async function getAgents() {
  const res = await fetch(`${API_BASE}/agents/`);
  return handleResponse(res);
}

export async function registerAgent(agent: any) {
  const res = await fetch(`${API_BASE}/agents/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(agent),
  });
  return handleResponse(res);
}

export async function deregisterAgent(agentId: string) {
  const res = await fetch(`${API_BASE}/agents/${agentId}`, { method: 'DELETE' });
  return handleResponse(res);
}

// Tools
export async function getTools() {
  const res = await fetch(`${API_BASE}/tools/`);
  return handleResponse(res);
}

export async function registerTool(tool: any) {
  const res = await fetch(`${API_BASE}/tools/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tool),
  });
  return handleResponse(res);
}

// Chat
export async function chatWithAgent(agentId: string, message: string) {
  const res = await fetch(`${API_BASE}/chat/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agent_id: agentId, message }),
  });
  return handleResponse(res);
}

// Logs
export async function getLogs() {
  const res = await fetch(`${API_BASE}/logs/`);
  return handleResponse(res);
} 
