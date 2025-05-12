import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Paper, List, ListItem, ListItemText } from '@mui/material';
import { getTools, registerTool } from './services/api';

interface Tool {
  id: string;
  name: string;
  description?: string;
  endpoint: string;
  config?: Record<string, any>;
}

const ToolManager: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', endpoint: '', config: '' });
  const [error, setError] = useState('');

  const fetchTools = async () => {
    setLoading(true);
    try {
      const data = await getTools();
      setTools(data);
    } catch (e) {
      setError('Failed to fetch tools');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const configObj = form.config ? JSON.parse(form.config) : undefined;
      await registerTool({ name: form.name, description: form.description, endpoint: form.endpoint, config: configObj });
      setForm({ name: '', description: '', endpoint: '', config: '' });
      fetchTools();
    } catch (e) {
      setError('Failed to register tool. Config must be valid JSON.');
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Register New Tool</Typography>
        <form onSubmit={handleRegister} style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <TextField label="Name" name="name" value={form.name} onChange={handleChange} required size="small" />
          <TextField label="Description" name="description" value={form.description} onChange={handleChange} size="small" />
          <TextField label="Endpoint" name="endpoint" value={form.endpoint} onChange={handleChange} required size="small" />
          <TextField label="Config (JSON)" name="config" value={form.config} onChange={handleChange} size="small" />
          <Button type="submit" variant="contained" sx={{ minWidth: 120 }}>Register</Button>
        </form>
        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
      </Paper>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Registered Tools</Typography>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <List>
            {tools.map(tool => (
              <ListItem key={tool.id}>
                <ListItemText
                  primary={<>
                    <b>{tool.name}</b> {tool.description && `- ${tool.description}`}
                  </>}
                  secondary={<>
                    <div>Endpoint: {tool.endpoint}</div>
                    {tool.config && <pre style={{ margin: 0 }}>{JSON.stringify(tool.config, null, 2)}</pre>}
                  </>}
                />
              </ListItem>
            ))}
            {tools.length === 0 && <Typography>No tools registered.</Typography>}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default ToolManager; 
