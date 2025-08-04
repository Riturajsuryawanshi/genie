const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  assignedPhoneNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  preferences: {
    voiceModel: {
      type: String,
      enum: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'],
      default: 'alloy'
    },
    aiModel: {
      type: String,
      enum: ['gpt-4-turbo-preview', 'gpt-3.5-turbo'],
      default: 'gpt-4-turbo-preview'
    },
    responseLength: {
      type: String,
      enum: ['short', 'medium', 'long'],
      default: 'medium'
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired'],
      default: 'active'
    },
    expiresAt: Date,
    stripeCustomerId: String,
    stripeSubscriptionId: String
  },
  usage: {
    totalCalls: {
      type: Number,
      default: 0
    },
    totalMinutes: {
      type: Number,
      default: 0
    },
    monthlyCallsUsed: {
      type: Number,
      default: 0
    },
    monthlyMinutesUsed: {
      type: Number,
      default: 0
    },
    lastResetDate: {
      type: Date,
      default: Date.now
    }
  },
  businessInfo: {
    companyName: String,
    industry: String,
    businessHours: {
      start: String,
      end: String,
      timezone: String
    },
    customGreeting: String,
    customInstructions: String
  }
}, {
  timestamps: true
});

// Index for faster lookups
userProfileSchema.index({ userId: 1 });
userProfileSchema.index({ assignedPhoneNumber: 1 });

module.exports = mongoose.model('UserProfile', userProfileSchema);