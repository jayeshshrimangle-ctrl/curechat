// ============================================
// MedicineReminder Model - User Medication Schedules
// Tracks dosage, time, frequency, missed doses
// ============================================

const mongoose = require('mongoose');

const medicineReminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  dosage: {
    type: String,
    required: true // "500mg tablet"
  },
  frequency: {
    type: String,
    enum: ['once-daily', 'twice-daily', 'thrice-daily', 'weekly', 'custom'],
    required: true
  },
  time: {
    type: String, // "09:00 AM"
    required: true
  },
  duration: {
    type: Number, // days
    default: 30
  },
  instructions: {
    type: String,
    default: 'Take with water after meals'
  },
  missedDoses: [{
    date: Date,
    reason: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  nextDose: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for reminders
medicineReminderSchema.index({ userId: 1, isActive: 1, nextDose: 1 });

module.exports = mongoose.model('MedicineReminder', medicineReminderSchema);

