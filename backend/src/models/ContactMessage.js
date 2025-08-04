const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  company: {
    type: String,
    trim: true,
    maxlength: 100
  },
  subject: {
    type: String,
    required: true,
    enum: ['general', 'demo', 'support', 'pricing', 'partnership'],
    default: 'general'
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  status: {
    type: String,
    enum: ['new', 'read', 'responded', 'closed'],
    default: 'new'
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries
contactMessageSchema.index({ email: 1 });
contactMessageSchema.index({ status: 1 });
contactMessageSchema.index({ createdAt: -1 });

// Method to get subject display name
contactMessageSchema.methods.getSubjectDisplay = function() {
  const subjectMap = {
    'general': 'General Inquiry',
    'demo': 'Request Demo',
    'support': 'Technical Support',
    'pricing': 'Pricing Questions',
    'partnership': 'Partnership'
  };
  return subjectMap[this.subject] || 'General Inquiry';
};

module.exports = mongoose.model('ContactMessage', contactMessageSchema);