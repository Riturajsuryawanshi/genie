const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  planName: {
    type: String,
    required: true,
    enum: ['free', 'basic', 'premium', 'enterprise'],
    default: 'free'
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active'
  },
  renewalDate: {
    type: Date
  },
  features: {
    maxCalls: {
      type: Number,
      default: 10
    },
    maxMinutes: {
      type: Number,
      default: 60
    },
    aiSupport: {
      type: Boolean,
      default: true
    },
    voicemailTranscription: {
      type: Boolean,
      default: false
    },
    analytics: {
      type: Boolean,
      default: false
    }
  },
  stripeCustomerId: {
    type: String
  },
  stripeSubscriptionId: {
    type: String
  }
}, {
  timestamps: true
});

// Index for faster queries
planSchema.index({ userId: 1 });

module.exports = mongoose.model('Plan', planSchema);