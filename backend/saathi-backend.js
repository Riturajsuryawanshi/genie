const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// Simple chat endpoint that SaathiChat expects
app.post('/api/gpt/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    // Simple mock responses
    const responses = [
      "Hello! I'm SAATHI, your AI assistant. How can I help you today?",
      "That's an interesting question! I'm here to help you with whatever you need.",
      "I understand. Let me assist you with that.",
      "Great question! I'm happy to help you explore that topic.",
      "Thanks for asking! I'm here to provide you with helpful information."
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];

    res.json({
      success: true,
      response: response
    });

  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get AI response'
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'SAATHI Backend is running' });
});

const PORT = 4002;
app.listen(PORT, () => {
  console.log(`🚀 SAATHI Backend running on port ${PORT}`);
  console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/gpt/chat`);
});