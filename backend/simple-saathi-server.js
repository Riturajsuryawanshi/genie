const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// Mock GPT route
app.get('/api/gpt/health', (req, res) => res.json({ success: true, route: 'gpt' }));

const getMockResponse = (message) => {
  const msg = message.toLowerCase();
  
  if (msg.includes('hello') || msg.includes('hi')) {
    return "Hello! I'm SAATHI, your AI assistant. How can I help you today?";
  }
  if (msg.includes('how are you')) {
    return "I'm doing great, thank you for asking! I'm here and ready to assist you with any questions or tasks you have.";
  }
  if (msg.includes('weather')) {
    return "I don't have access to real-time weather data, but I'd recommend checking a weather app or website for current conditions in your area.";
  }
  if (msg.includes('time')) {
    return `The current time is ${new Date().toLocaleTimeString()}.`;
  }
  if (msg.includes('help')) {
    return "I'm here to help! You can ask me questions, have conversations, or request assistance with various topics. What would you like to know?";
  }
  if (msg.includes('thank')) {
    return "You're very welcome! I'm happy to help. Is there anything else you'd like to know?";
  }
  
  const responses = [
    "That's an interesting question! While I'm currently running in demo mode, I'd be happy to discuss that topic with you.",
    "I understand what you're asking about. In full mode, I could provide more detailed assistance with that.",
    "Thanks for sharing that with me! I'm here to help however I can.",
    "That's a great point! I appreciate you bringing that up.",
    "I see what you mean. Let me know if you'd like to explore that topic further."
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

app.post('/api/gpt/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    const response = getMockResponse(message);

    res.json({
      success: true,
      response: response
    });

  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get AI response',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'SAATHI Simple Backend is running',
    timestamp: new Date().toISOString(),
    services: {
      gpt: 'active (mock mode)',
      chat: 'active'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 SAATHI Simple Backend running on port ${PORT}`);
  console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/gpt/chat`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  console.log(`📝 Note: Running in mock mode - no OpenAI API required`);
});