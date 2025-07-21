const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'SAATHI Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Simple auth endpoints for testing
app.get('/api/auth/phone/:userId', (req, res) => {
  res.json({ 
    success: true, 
    phone_number: '+1234567890',
    message: 'Test phone number'
  });
});

app.get('/api/auth/user/:userId', (req, res) => {
  res.json({ 
    success: true, 
    user: {
      id: req.params.userId,
      email: 'test@example.com',
      full_name: 'Test User',
      account_status: 'active'
    }
  });
});

app.get('/api/auth/usage/:userId', (req, res) => {
  res.json({ 
    success: true, 
    usage: {
      calls_made: 5,
      minutes_used: 30,
      ai_response_rate: 95
    }
  });
});

app.get('/api/auth/plan/:userId', (req, res) => {
  res.json({ 
    success: true, 
    plan: {
      plan_name: 'Basic',
      status: 'active',
      features: ['voice_calls', 'ai_assistant']
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: error.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 SAATHI Backend API running on port ${PORT}`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
}); 