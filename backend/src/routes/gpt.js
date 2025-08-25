const express = require('express');
const { generateGeminiResponse } = require('../services/gemini');
const router = express.Router();

router.get('/health', (req, res) => res.json({ success: true, route: 'gpt' }));

router.post('/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [], phoneNumber = null } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    // Generate response using Gemini
    const result = await generateGeminiResponse(message, phoneNumber, {
      conversationHistory,
      voiceMode: 'text'
    });

    if (result.success) {
      res.json({
        success: true,
        response: result.response,
        conversationId: result.conversationId
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error || 'Failed to get AI response'
      });
    }

  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get AI response',
      details: error.message
    });
  }
});

module.exports = router;