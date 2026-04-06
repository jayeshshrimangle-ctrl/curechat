// ============================================
// Mental Health Routes - Student Wellness API
// ============================================

const express = require('express');
const router = express.Router();
const mentalHealthController = require('../controllers/mentalHealthController');
const authMiddleware = require('../middleware/authMiddleware');

// Log mood (daily/manual/chat-triggered)
router.post('/log', authMiddleware, mentalHealthController.logMood);

// Daily check-in status & prompt
router.post('/checkin', authMiddleware, mentalHealthController.dailyCheckin);

// Get mood trends for dashboard (30/7 days)
router.get('/trends', authMiddleware, mentalHealthController.getMoodTrends);

// India crisis helplines
router.get('/helplines', (req, res) => {
  mentalHealthController.getHelplines(req, res);
});

module.exports = router;

