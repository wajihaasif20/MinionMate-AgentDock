import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Paper, List, ListItem, ListItemText, IconButton, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAgents, registerAgent, deregisterAgent } from './services/api';

interface Agent {
  id: string;
  code: string;
  description?: string;
  config?: Record<string, any>;
}

const AgentManager: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ code: '', description: '', config: '' });
  const [error, setError] = useState('');

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const data = await getAgents();
      setAgents(data);
    } catch (e) {
      setError('Failed to fetch agents');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const configObj = form.config ? JSON.parse(form.config) : undefined;
      await registerAgent({ code: form.code, description: form.description, config: configObj });
      setForm({ code: '', description: '', config: '' });
      fetchAgents();
    } catch (e) {
      setError('Failed to register agent. Config must be valid JSON.');
    }
  };

  const handleDelete = async (id: string) => {
    await deregisterAgent(id);
    fetchAgents();
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Register New Agent</Typography>
        <form onSubmit={handleRegister} style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <TextField label="Code" name="code" value={form.code} onChange={handleChange} required size="small" />
          <TextField label="Description" name="description" value={form.description} onChange={handleChange} size="small" />
          <TextField label="Config (JSON)" name="config" value={form.config} onChange={handleChange} size="small" />
          <Button type="submit" variant="contained" sx={{ minWidth: 120 }}>Register</Button>
        </form>
        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
      </Paper>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Registered Agents</Typography>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <List>
            {agents.map(agent => (
              <ListItem key={agent.id} secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(agent.id)}>
                  <DeleteIcon />
                </IconButton>
              }>
                <ListItemText
                  primary={<>
                    <b>{agent.code}</b> {agent.description && `- ${agent.description}`}
                  </>}
                  secondary={agent.config ? <pre style={{ margin: 0 }}>{JSON.stringify(agent.config, null, 2)}</pre> : null}
                />
              </ListItem>
            ))}
            {agents.length === 0 && <Typography>No agents registered.</Typography>}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default AgentManager; 
