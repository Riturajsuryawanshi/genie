const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/callgenie';
mongoose.connect(mongoURI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String },
  role: { type: String, default: 'user' },
  accountStatus: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model('User', userSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'CallGenie Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Signup endpoint
app.post('/api/auth/signup', async (req, res) => {
  try {
    console.log('📧 Signup request received:', { email: req.body.email, name: req.body.name });
    
    const { email, password, name, phone } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and name are required'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Create user
    const user = new User({
      email,
      password,
      name,
      phone: phone || ''
    });

    await user.save();

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    console.log('✅ User created successfully:', user.email);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone
      },
      token
    });

  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during signup'
    });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('🔐 Login request received:', { email: req.body.email });
    
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    console.log('✅ User logged in successfully:', user.email);

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone
      },
      token
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during login'
    });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log('🚀 CallGenie Backend Server Started!');
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🔥 API endpoints available:`);
  console.log(`   📋 Health: GET  http://localhost:${PORT}/api/health`);
  console.log(`   🔐 Login:  POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   📧 Signup: POST http://localhost:${PORT}/api/auth/signup`);
  console.log(`   🧪 Test:   GET  http://localhost:${PORT}/api/test`);
  console.log('==========================================');
});