const express = require('express');
const userService = require('../services/userService');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const profile = await userService.getUserProfile(req.user.id);
    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Assign phone number to user
router.post('/assign-phone', auth, async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        error: 'Phone number is required'
      });
    }

    const profile = await userService.assignPhoneNumber(req.user.id, phoneNumber);
    
    res.json({
      success: true,
      message: 'Phone number assigned successfully',
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get conversation history
router.get('/conversations', auth, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const conversations = await userService.getConversationHistory(req.user.id, parseInt(limit));
    
    res.json({
      success: true,
      data: conversations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update user preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const preferences = req.body;
    const profile = await userService.updateUserPreferences(req.user.id, preferences);
    
    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: profile.preferences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Check usage limits
router.get('/usage', auth, async (req, res) => {
  try {
    const usage = await userService.checkUsageLimits(req.user.id);
    res.json({
      success: true,
      data: usage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;