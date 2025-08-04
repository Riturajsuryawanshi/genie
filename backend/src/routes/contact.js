const express = require('express');
const rateLimit = require('express-rate-limit');
const ContactMessage = require('../models/ContactMessage');
const router = express.Router();

// Rate limiting for contact form - 5 messages per 15 minutes per IP
const contactRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    error: 'Too many contact form submissions, please try again later.',
    retryAfter: 15 * 60 * 1000
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Input validation middleware
const validateContactInput = (req, res, next) => {
  const { name, email, subject, message } = req.body;
  
  // Check required fields
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      error: 'Please fill in all required fields (name, email, subject, message)'
    });
  }
  
  // Validate email format
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Please enter a valid email address'
    });
  }
  
  // Validate subject
  const validSubjects = ['general', 'demo', 'support', 'pricing', 'partnership'];
  if (!validSubjects.includes(subject)) {
    return res.status(400).json({
      success: false,
      error: 'Please select a valid subject'
    });
  }
  
  // Validate lengths
  if (name.length > 100) {
    return res.status(400).json({
      success: false,
      error: 'Name must not exceed 100 characters'
    });
  }
  
  if (message.length > 2000) {
    return res.status(400).json({
      success: false,
      error: 'Message must not exceed 2000 characters'
    });
  }
  
  if (req.body.company && req.body.company.length > 100) {
    return res.status(400).json({
      success: false,
      error: 'Company name must not exceed 100 characters'
    });
  }
  
  next();
};

// POST /api/contact - Submit contact form
router.post('/', contactRateLimit, validateContactInput, async (req, res) => {
  try {
    const { name, email, company, subject, message } = req.body;
    
    // Get client IP and user agent
    const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
    const userAgent = req.headers['user-agent'];
    
    // Create new contact message
    const contactMessage = new ContactMessage({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: company ? company.trim() : undefined,
      subject,
      message: message.trim(),
      ipAddress,
      userAgent
    });
    
    // Save to database
    await contactMessage.save();
    
    console.log(`📧 New contact message received from ${email} (${subject})`);
    
    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully! We\'ll get back to you soon.',
      data: {
        id: contactMessage._id,
        timestamp: contactMessage.createdAt
      }
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to send message. Please try again later.'
    });
  }
});

// GET /api/contact - Get all contact messages (admin only - you might want to add auth middleware)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const skip = (page - 1) * limit;
    
    // Build query
    const query = {};
    if (status && ['new', 'read', 'responded', 'closed'].includes(status)) {
      query.status = status;
    }
    
    // Get messages with pagination
    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get total count
    const total = await ContactMessage.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    
    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          currentPage: page,
          totalPages,
          totalMessages: total,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
    
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contact messages'
    });
  }
});

// PUT /api/contact/:id/status - Update message status (admin only)
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    if (!['new', 'read', 'responded', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be one of: new, read, responded, closed'
      });
    }
    
    // Update message
    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Contact message not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Status updated successfully',
      data: message
    });
    
  } catch (error) {
    console.error('Error updating contact message status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update message status'
    });
  }
});

module.exports = router;