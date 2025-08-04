const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  callSid: {
    type: String,
    unique: true,
    sparse: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  userMessage: {
    type: String,
    required: true
  },
  aiResponse: {
    type: String,
    required: true
  },
  audioUrl: {
    type: String
  },
  responseAudioUrl: {
    type: String
  },
  duration: {
    type: Number // in seconds
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing'
  },
  metadata: {
    transcriptionTime: Number,
    responseTime: Number,
    ttsTime: Number,
    totalProcessingTime: Number
  }
}, {
  timestamps: true
});

// Indexes for better query performance
conversationSchema.index({ userId: 1, createdAt: -1 });
conversationSchema.index({ phoneNumber: 1, createdAt: -1 });
conversationSchema.index({ sessionId: 1 });

module.exports = mongoose.model('Conversation', conversationSchema);