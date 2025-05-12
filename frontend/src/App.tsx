import React from 'react';
import { Box, CssBaseline, Drawer, List, ListItem, ListItemText, AppBar, Toolbar, Typography, ListItemButton, ThemeProvider, createTheme } from '@mui/material';
import AgentManager from './AgentManager';
import ToolManager from './ToolManager';
import ChatInterface from './ChatInterface';
import LogsInterface from './LogsInterface';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF69B4', // Hot pink
      light: '#FFB6C1', // Light pink
      dark: '#C71585', // Deep pink
    },
    secondary: {
      main: '#FFD700', // Gold (Minions color)
      light: '#FFF8DC', // Cornsilk
      dark: '#DAA520', // Goldenrod
    },
    background: {
      default: '#FFF0F5', // Lavender blush
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(45deg, #FF69B4 30%, #FFD700 90%)',
          color: '#FFFFFF',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #FF69B4 30%, #FFD700 90%)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
  },
});

const drawerWidth = 240;

function App() {
  const [selected, setSelected] = React.useState('Agents');

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh', background: '#FFF0F5' }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: 1201 }}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div" sx={{ 
              fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #FFD700, #FFFFFF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              AgentDock — Multi-Agent MCP Server
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { 
              width: drawerWidth, 
              boxSizing: 'border-box',
              borderRight: '2px solid #FFD700',
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto', mt: 2 }}>
            <List>
              {['Agents', 'Tools', 'Chat', 'Logs'].map((text) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton 
                    selected={selected === text} 
                    onClick={() => setSelected(text)}
                    sx={{
                      borderRadius: '0 20px 20px 0',
                      margin: '4px 0',
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      },
                    }}
                  >
                    <ListItemText 
                      primary={text} 
                      sx={{
                        '& .MuiTypography-root': {
                          fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
                          fontWeight: selected === text ? 'bold' : 'normal',
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: 3, 
            ml: `${drawerWidth}px`,
            background: 'linear-gradient(135deg, #FFF0F5 0%, #FFE4E1 100%)',
            minHeight: '100vh',
          }}
        >
          <Toolbar />
          {selected === 'Agents' && <AgentManager />}
          {selected === 'Tools' && <ToolManager />}
          {selected === 'Chat' && <ChatInterface />}
          {selected === 'Logs' && <LogsInterface />}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
