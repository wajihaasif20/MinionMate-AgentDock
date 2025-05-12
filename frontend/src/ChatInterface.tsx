import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  List, 
  ListItem, 
  ListItemText,
  CircularProgress,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Send as SendIcon, Refresh as RefreshIcon, Mic as MicIcon, MicOff as MicOffIcon } from '@mui/icons-material';
import { getAgents, chatWithAgent } from './services/api';

interface Agent {
  id: string;
  code: string;
  description?: string;
}

interface Message {
  agentId: string;
  message: string;
  response: string;
  timestamp: string;
}

const ChatInterface: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const data = await getAgents();
        setAgents(data);
        if (data.length > 0) {
          setSelectedAgent(data[0].id);
        }
      } catch (err) {
        console.error('Error fetching agents:', err);
        setError('Failed to load agents');
      } finally {
        setLoadingAgents(false);
      }
    };

    fetchAgents();

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setMessage(prev => prev + (prev ? ' ' : '') + transcript);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setError('Speech recognition failed. Please try again.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
    }
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedAgent) return;

    setLoading(true);
    setError('');
    try {
      const response = await chatWithAgent(selectedAgent, message);
      setMessages(prev => [...prev, {
        agentId: selectedAgent,
        message,
        response: response.response,
        timestamp: new Date().toISOString()
      }]);
      setMessage('');
    } catch (err) {
      console.error('Chat error:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const getAgentName = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    return agent ? agent.code : agentId;
  };

  const toggleListening = () => {
    if (!recognition) {
      setError('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.start();
        setIsListening(true);
        setError('');
      } catch (err) {
        console.error('Error starting speech recognition:', err);
        setError('Failed to start speech recognition.');
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          borderRadius: 4,
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF0F5 100%)',
          border: '2px solid #FFD700',
        }}
      >
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            color: '#FF69B4',
            fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 3,
          }}
        >
          Chat with Your Agents
        </Typography>

        <FormControl 
          fullWidth 
          sx={{ 
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover fieldset': {
                borderColor: '#FF69B4',
              },
            },
          }}
        >
          <InputLabel>Select Agent</InputLabel>
          <Select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            label="Select Agent"
            disabled={loadingAgents}
          >
            {loadingAgents ? (
              <MenuItem disabled>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Loading agents...
              </MenuItem>
            ) : (
              agents.map((agent) => (
                <MenuItem key={agent.id} value={agent.id}>
                  {agent.code}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        <Box 
          component="form" 
          onSubmit={handleSend}
          sx={{ 
            display: 'flex', 
            gap: 2,
            mb: 3,
          }}
        >
          <TextField
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message or click the microphone to speak..."
            disabled={loading || !selectedAgent}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: '#FF69B4',
                },
              },
            }}
          />
          <Tooltip title={isListening ? "Stop listening" : "Start voice input"}>
            <IconButton
              onClick={toggleListening}
              disabled={loading || !selectedAgent}
              sx={{
                color: isListening ? '#FF1493' : '#FF69B4',
                '&:hover': {
                  backgroundColor: 'rgba(255, 105, 180, 0.1)',
                },
              }}
            >
              {isListening ? <MicOffIcon /> : <MicIcon />}
            </IconButton>
          </Tooltip>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !selectedAgent || !message.trim()}
            sx={{
              borderRadius: 2,
              minWidth: 100,
              background: 'linear-gradient(45deg, #FF69B4 30%, #FFD700 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF1493 30%, #DAA520 90%)',
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
          </Button>
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
          maxHeight: 400, 
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
          {messages.map((msg, index) => (
            <ListItem 
              key={index} 
              sx={{ 
                flexDirection: 'column',
                alignItems: 'flex-start',
                mb: 2,
                p: 2,
                borderRadius: 2,
                backgroundColor: '#FFFFFF',
                border: '1px solid #FFD700',
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 1,
                width: '100%',
              }}>
                <Chip
                  label={getAgentName(msg.agentId)}
                  sx={{
                    backgroundColor: '#FFD700',
                    color: '#000000',
                    fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
                    fontWeight: 'bold',
                  }}
                />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    ml: 'auto',
                    color: '#666',
                    fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
                  }}
                >
                  {new Date(msg.timestamp).toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                width: '100%',
                gap: 2,
              }}>
                <Avatar 
                  sx={{ 
                    bgcolor: '#FF69B4',
                    width: 32,
                    height: 32,
                  }}
                >
                  👤
                </Avatar>
                <Paper 
                  sx={{ 
                    p: 2,
                    backgroundColor: '#FFF0F5',
                    borderRadius: 2,
                    flex: 1,
                  }}
                >
                  <Typography 
                    sx={{ 
                      fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
                    }}
                  >
                    {msg.message}
                  </Typography>
                </Paper>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                width: '100%',
                gap: 2,
                mt: 1,
              }}>
                <Avatar 
                  sx={{ 
                    bgcolor: '#FFD700',
                    width: 32,
                    height: 32,
                  }}
                >
                  🤖
                </Avatar>
                <Paper 
                  sx={{ 
                    p: 2,
                    backgroundColor: '#FFF8DC',
                    borderRadius: 2,
                    flex: 1,
                  }}
                >
                  <Typography 
                    sx={{ 
                      fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
                    }}
                  >
                    {msg.response}
                  </Typography>
                </Paper>
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default ChatInterface; 
