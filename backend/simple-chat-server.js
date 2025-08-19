const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/api/gpt/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const messages = [
      { role: 'system', content: 'You are SAATHI, a helpful AI assistant. Be concise and friendly.' },
      ...conversationHistory.slice(-10),
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7
    });

    const response = completion.choices[0].message.content;

    res.json({
      success: true,
      response: response
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get AI response',
      details: error.message
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Chat server running' });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Chat server running on port ${PORT}`);
});