const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// POST /api/auth/onboard
app.post('/api/auth/onboard', (req, res) => {
  res.json({ 
    success: true, 
    message: 'User onboarded successfully',
    user: { id: req.body.userId, email: req.body.email }
  });
});

// GET /api/auth/phone/:userId
app.get('/api/auth/phone/:userId', (req, res) => {
  res.json({ 
    success: true, 
    phone_number: '+1-555-123-4567' 
  });
});

// GET /api/auth/user/:userId
app.get('/api/auth/user/:userId', (req, res) => {
  res.json({ 
    success: true, 
    user: {
      id: req.params.userId,
      email: 'user@example.com',
      full_name: 'Test User',
      account_status: 'active'
    }
  });
});

// GET /api/auth/usage/:userId
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

// GET /api/auth/activity/:userId
app.get('/api/auth/activity/:userId', (req, res) => {
  res.json({ 
    success: true, 
    activity: [
      { id: 1, type: 'call', description: 'Made a call', created_at: new Date().toISOString() }
    ]
  });
});

// GET /api/auth/plan/:userId
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

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Simple server running on port ${PORT}`);
}); 