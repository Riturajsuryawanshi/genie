const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Local server running',
    timestamp: new Date().toISOString()
  });
});

// Mock auth endpoint
app.post('/api/auth/onboard', (req, res) => {
  res.json({
    success: true,
    message: 'Phone number assigned successfully',
    phoneNumber: req.body.phoneNumber
  });
});

// Mock webhook endpoint
app.post('/api/webhook/test', (req, res) => {
  res.json({
    success: true,
    message: 'Webhook received',
    data: req.body
  });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Local server running on port ${PORT}`);
  console.log(`💚 Health: http://localhost:${PORT}/health`);
});