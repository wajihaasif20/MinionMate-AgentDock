import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { getLogs } from './services/api';

interface LogEntry {
  timestamp: string;
  agent_id?: string;
  tool_id?: string;
  action: string;
  output?: string;
}

const LogsInterface: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getLogs();
      setLogs(data);
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError('Failed to load logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'register':
        return '#4CAF50';
      case 'deregister':
        return '#F44336';
      case 'chat':
        return '#2196F3';
      default:
        return '#FFD700';
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          borderRadius: 4,
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF0F5 100%)',
          border: '2px solid #FFD700',
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3,
        }}>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#FF69B4',
              fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
              fontWeight: 'bold',
            }}
          >
            Agent Activity Logs
          </Typography>
          <Tooltip title="Refresh Logs">
            <IconButton 
              onClick={fetchLogs} 
              disabled={loading}
              sx={{
                color: '#FF69B4',
                '&:hover': {
                  backgroundColor: 'rgba(255, 105, 180, 0.1)',
                },
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {error && (
          <Typography 
            color="error" 
            sx={{ 
              mb: 2,
              p: 2,
              borderRadius: 2,
              backgroundColor: '#FFE4E1',
              border: '1px solid #FF69B4',
            }}
          >
            {error}
          </Typography>
        )}

        <List sx={{ 
          maxHeight: 600, 
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#FFF0F5',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#FF69B4',
            borderRadius: '4px',
            '&:hover': {
              background: '#FF1493',
            },
          },
        }}>
          {loading && logs.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress sx={{ color: '#FF69B4' }} />
            </Box>
          ) : (
            logs.map((log, index) => (
              <ListItem 
                key={index} 
                sx={{ 
                  mb: 2,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #FFD700',
                  '&:hover': {
                    backgroundColor: '#FFF8DC',
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Chip
                        label={log.action}
                        size="small"
                        sx={{
                          backgroundColor: getActionColor(log.action),
                          color: '#FFFFFF',
                          fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
                          fontWeight: 'bold',
                        }}
                      />
                      {log.agent_id && (
                        <Chip
                          label={`Agent: ${log.agent_id}`}
                          size="small"
                          sx={{
                            backgroundColor: '#FFD700',
                            color: '#000000',
                            fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
                          }}
                        />
                      )}
                      {log.tool_id && (
                        <Chip
                          label={`Tool: ${log.tool_id}`}
                          size="small"
                          sx={{
                            backgroundColor: '#FF69B4',
                            color: '#FFFFFF',
                            fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
                          }}
                        />
                      )}
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          ml: 'auto',
                          color: '#666',
                          fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
                        }}
                      >
                        {new Date(log.timestamp).toLocaleString()}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    log.output && (
                      <Typography 
                        sx={{ 
                          mt: 1,
                          p: 1,
                          backgroundColor: '#FFF0F5',
                          borderRadius: 1,
                          fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
                        }}
                      >
                        {log.output}
                      </Typography>
                    )
                  }
                />
              </ListItem>
            ))
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default LogsInterface; 
