const mongoose = require('mongoose');

const usageStatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  callsMade: {
    type: Number,
    default: 0
  },
  minutesUsed: {
    type: Number,
    default: 0
  },
  aiResponseRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  voicemails: {
    type: Number,
    default: 0
  },
  lastCallDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
usageStatsSchema.index({ userId: 1 });

module.exports = mongoose.model('UsageStats', usageStatsSchema);