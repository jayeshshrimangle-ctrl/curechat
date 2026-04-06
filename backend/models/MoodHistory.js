// ============================================
// MoodHistory Model - Student Mental Health Tracking
// Securely tracks daily moods, sentiments, triggers for progress analytics
// ============================================

const mongoose = require('mongoose');

const moodHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  moodScore: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    // 1=Very Sad 😢, 2=Sad 😞, 3=Neutral 😐, 4=Happy 🙂, 5=Great 😊 (frontend emojis)
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  sentiment: {
    type: String,
    enum: ['very-negative', 'negative', 'neutral', 'positive', 'very-positive'],
    default: 'neutral'
  },
  detectedMood: {
    type: String,
    enum: ['stressed', 'anxious', 'depressed', 'happy', 'motivated', 'overwhelmed', 'neutral'],
    default: 'neutral'
  },
  triggers: [{
    type: String,
    trim: true
  }],
  checkinType: {
    type: String,
    enum: ['daily', 'chat-triggered', 'manual', 'crisis'],
    default: 'daily'
  },
  isAnonymous: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient trends/queries
moodHistorySchema.index({ userId: 1, createdAt: -1 });
moodHistorySchema.index({ userId: 1, moodScore: 1 });

// Average mood calculation helper (virtual)
moodHistorySchema.virtual('weeklyAverage').get(function() {
  // Computed in controller for flexibility
  return null;
});

module.exports = mongoose.model('MoodHistory', moodHistorySchema);

