const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Import MongoDB connection
const connectMongoDB = require('./services/config/mongodb');

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB (optional)
connectMongoDB().catch(err => {
  console.error('⚠️  MongoDB connection failed:', err.message);
  console.log('📝 Server will continue without MongoDB. Chat history won\'t be saved.');
});

// Import routes
const authRoutes = require('./routes/auth-mongodb'); // Use MongoDB auth routes
const userRoutes = require('./routes/user');
const gptRoutes = require('./routes/gpt');
const sttRoutes = require('./routes/stt');
const callRoute = require('./routes/call');
const contactRoutes = require('./routes/contact');
const webhookRoutes = require('./routes/webhook');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/gpt', gptRoutes);
app.use('/api/stt', sttRoutes);
app.use('/api/call', callRoute);
app.use('/api/contact', contactRoutes);
app.use('/api/webhook', webhookRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'SAATHI Backend API is running',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected (optional)',
    services: {
      auth: 'active',
      webhook: 'active',
      whisper: 'active',
      gpt: 'active',
      tts: 'active'
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
  console.log(`📞 Webhook endpoint: http://localhost:${PORT}/api/webhook/webhook`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/webhook/test`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
}); 