# AI Agent Management System

A beautiful and user-friendly web application for managing AI agents, tools, and chat interactions with a fun Minions-themed UI.

## Features

- 🤖 **Agent Management**: Register and manage AI agents
- 🛠️ **Tool Integration**: Register and configure tools for agents
- 💬 **Chat Interface**: Interact with agents through text and voice
- 📝 **Activity Logs**: Monitor agent actions and tool usage
- 🎨 **Beautiful UI**: Fun Minions-themed design with girly aesthetics
- 🎤 **Voice Input**: Speak to your agents using voice-to-text

## Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn
- Groq API key (for chat functionality)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Backend Setup

1. Create and activate a virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the backend directory:
```bash
echo "GROQ_API_KEY=your_groq_api_key_here" > .env
```

4. Start the backend server:
```bash
uvicorn main:app --reload
```

### 3. Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Usage Guide

### Agent Registration

1. Navigate to the "Agents" tab
2. Click "Register New Agent"
3. Fill in the required fields:
   - Agent Code (e.g., "MathAgent")
   - Description (optional)
4. Click "Register"

### Tool Registration

1. Go to the "Tools" tab
2. Click "Register New Tool"
3. Provide the following information:
   - Tool Name (e.g., "GitHub API")
   - Description (e.g., "GitHub REST API Integration")
   - Endpoint (e.g., "https://api.github.com")
   - Configuration (JSON format, e.g., `{"token": "your-token"}`)
4. Click "Register"

### Chat Interface

1. Select the "Chat" tab
2. Choose an agent from the dropdown menu
3. Interact with the agent in two ways:
   - Type your message and click send
   - Click the microphone icon and speak your message
4. View the conversation history below

### Voice Input

1. Click the microphone icon next to the message input
2. Allow microphone access when prompted
3. Speak your message clearly
4. The text will automatically appear in the input field
5. Click send to submit your message

### Activity Logs

1. Go to the "Logs" tab
2. View real-time logs of:
   - Agent registrations
   - Tool usage
   - Chat interactions
3. Use the refresh button to update logs manually

## Browser Support

- Chrome (recommended)
- Edge
- Safari
- Firefox

Note: Voice-to-text feature requires browser support for the Web Speech API.

## Troubleshooting

### Common Issues

1. **Backend Connection Error**
   - Ensure the backend server is running
   - Check if the port 8000 is available
   - Verify CORS settings

2. **Voice Input Not Working**
   - Check browser compatibility
   - Ensure microphone permissions are granted
   - Try using Chrome browser

3. **Groq API Errors**
   - Verify your API key in the `.env` file
   - Check your internet connection
   - Ensure you have sufficient API credits

### Error Messages

- "Failed to load agents": Check backend connection
- "Speech recognition failed": Try using a different browser
- "Failed to send message": Verify agent selection and message content

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Groq API for chat functionality
- Material-UI for the component library
- Web Speech API for voice recognition
