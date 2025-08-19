const express = require('express');
const OpenAI = require('openai');
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.get('/health', (req, res) => res.json({ success: true, route: 'gpt' }));

router.post('/chat', async (req, res) => {
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

    try {
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
    } catch (openaiError) {
      // Fallback responses when OpenAI quota exceeded
      if (openaiError.status === 429 || openaiError.code === 'insufficient_quota') {
        const fallbackResponses = [
          "Hello! I'm SAATHI, your AI assistant. I'm currently experiencing high demand, but I'm here to help you with CallGenie.",
          "Hi there! Thanks for using CallGenie. How can I assist you today?",
          "Welcome to CallGenie! I'm SAATHI, ready to help with your voice assistant needs.",
          "Hello! I'm here to help you with CallGenie features and support.",
          "Hi! I'm SAATHI from CallGenie. What would you like to know about our AI voice services?"
        ];
        
        const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
        
        res.json({
          success: true,
          response: randomResponse + " (Note: AI services temporarily limited due to high usage)"
        });
      } else {
        throw openaiError;
      }
    }

  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get AI response',
      details: error.message
    });
  }
});

module.exports = router;