const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const UsageStats = require('../models/UsageStats');
const ActivityLog = require('../models/ActivityLog');
const Plan = require('../models/Plan');
const auth = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Health check
router.get('/health', (req, res) => res.json({ success: true, route: 'auth-mongodb' }));

// POST /auth/signup - Create a new user account
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and name are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password,
      name: name.trim(),
      phone: phone ? phone.trim() : '',
      isEmailVerified: true // Auto-verify for now
    });

    await user.save();

    // Create initial usage stats (with error handling)
    try {
      const usageStats = new UsageStats({ userId: user._id });
      await usageStats.save();
    } catch (statsError) {
      console.warn('Failed to create usage stats:', statsError.message);
    }

    // Create initial plan (with error handling)
    try {
      const plan = new Plan({ userId: user._id });
      await plan.save();
    } catch (planError) {
      console.warn('Failed to create plan:', planError.message);
    }

    // Log activity (with error handling)
    try {
      const activityLog = new ActivityLog({
        userId: user._id,
        type: 'signup',
        description: 'User account created'
      });
      await activityLog.save();
    } catch (logError) {
      console.warn('Failed to log activity:', logError.message);
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: user.toJSON(),
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: validationErrors.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to create account. Please try again.'
    });
  }
});

// POST /auth/login - Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Log activity
    const activityLog = new ActivityLog({
      userId: user._id,
      type: 'login',
      description: 'User logged in'
    });
    await activityLog.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      user: user.toJSON(),
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Login failed'
    });
  }
});

// POST /auth/onboard - Legacy endpoint for compatibility
router.post('/onboard', async (req, res) => {
  try {
    const userId = req.body.userId || req.body.user_id;
    const email = req.body.email;
    const fullName = req.body.fullName || req.body.full_name || req.body.name || null;
    const phone = req.body.phone_number || req.body.phone || '';

    if (!userId || !email) {
      return res.status(400).json({
        success: false,
        error: 'User ID and email are required'
      });
    }

    // Find or create user
    let user = await User.findById(userId);
    if (!user) {
      // Generate a secure random password for OAuth users
      const crypto = require('crypto');
      const randomPassword = crypto.randomBytes(32).toString('hex');
      
      user = new User({
        _id: userId,
        email: email,
        name: fullName || 'User',
        phone: phone,
        password: randomPassword,
        isEmailVerified: true
      });
      await user.save();

      // Create initial usage stats and plan
      const usageStats = new UsageStats({ userId: user._id });
      await usageStats.save();

      const plan = new Plan({ userId: user._id });
      await plan.save();
    } else {
      // Update existing user
      user.name = fullName || user.name;
      user.phone = phone || user.phone;
      await user.save();
    }

    res.json({
      success: true,
      message: 'User onboarded successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Onboard error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// GET /auth/user/:userId - Get user profile
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// GET /auth/usage/:userId - Get user usage stats
router.get('/usage/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const usage = await UsageStats.findOne({ userId });

    if (!usage) {
      return res.status(404).json({
        success: false,
        error: 'Usage stats not found'
      });
    }

    res.json({
      success: true,
      usage: {
        calls_made: usage.callsMade,
        minutes_used: usage.minutesUsed,
        ai_response_rate: usage.aiResponseRate,
        voicemails: usage.voicemails
      }
    });
  } catch (error) {
    console.error('Get usage error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// GET /auth/activity/:userId - Get user activity
router.get('/activity/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const activity = await ActivityLog.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      activity: activity.map(log => ({
        id: log._id,
        type: log.type,
        description: log.description,
        created_at: log.createdAt
      }))
    });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// GET /auth/plan/:userId - Get user plan
router.get('/plan/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const plan = await Plan.findOne({ userId });

    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'Plan not found'
      });
    }

    res.json({
      success: true,
      plan: {
        plan_name: plan.planName,
        renewal_date: plan.renewalDate,
        status: plan.status,
        features: plan.features
      }
    });
  } catch (error) {
    console.error('Get plan error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// POST /auth/verify-token - Verify JWT token
router.post('/verify-token', auth, async (req, res) => {
  res.json({
    success: true,
    user: req.user.toJSON()
  });
});

// GET /auth/users - Get all users (admin only)
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await User.countDocuments({});
    const totalPages = Math.ceil(total / limit);
    
    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers: total,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
});

module.exports = router;