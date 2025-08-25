const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import the Gemini service
// Note: Adjust the path if your file structure is different
const { generateGeminiResponse } = require('./src/services/gemini');

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// In-memory user storage
const users = new Map();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Auth routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;
    
    if (users.has(email)) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      _id: Date.now().toString(),
      email,
      name,
      phone,
      password: hashedPassword,
      accountStatus: 'active',
      role: 'user',
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.set(email, user);
    
    const token = jwt.sign({ userId: user._id, email }, JWT_SECRET);
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      user: userWithoutPassword,
      token,
      message: 'Account created successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.get(email);
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, email }, JWT_SECRET);
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      user: userWithoutPassword,
      token,
      message: 'Login successful'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Chat route with mock responses
app.post('/api/gpt/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [], userContext = {} } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    // Use the Gemini service to get a real AI response
    const geminiResult = await generateGeminiResponse(message, null, {
      conversationHistory,
      userContext
    });

    if (geminiResult.success) {
      res.json(geminiResult);
    } else {
      res.status(500).json(geminiResult);
    }

  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ success: false, error: 'An unexpected error occurred in the chat endpoint.' });
  }
});

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server running' });
});

const PORT = 4001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});