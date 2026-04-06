// ============================================
// Mental Health Controller - Student Wellness Features
// Handles mood logging, daily check-ins, trends, India crisis helplines
// ============================================

const MoodHistory = require('../models/MoodHistory');
const User = require('../models/User');

// India-specific emergency mental health helplines (24/7)
const INDIA_HELPLINES = [
  {
    name: 'iCall (TISS)',
    number: '9152987821',
    desc: 'Free 24/7 mental health helpline & counseling',
    website: 'https://icallhelpline.org/'
  },
  {
    name: 'Vandrevala Foundation',
    number: '18602662345 | 9999666555',
    desc: '24/7 crisis intervention & emotional support',
    website: 'https://www.vandrevalafoundation.com/'
  },
  {
    name: 'Kiran Mental Health',
    number: '18005990019',
    desc: 'Government 24/7 helpline (Hindi/English)',
    website: 'https://www.kiran.nic.in/'
  },
  {
    name: 'Sneha Foundation',
    number: '04424640050 | 04424640060',
    desc: 'Chennai-based suicide prevention (daily 10am-10pm)',
    website: 'https://www.sneha.in/'
  },
  {
    name: 'AASRA',
    number: '91-22-27546669',
    desc: 'Suicide prevention helpline (24/7)',
    website: 'http://www.aasra.info/'
  }
];

// Log mood entry (daily check-in or chat-triggered)
exports.logMood = async (req, res) => {
  try {
    const { moodScore, notes, sentiment, triggers = [], checkinType = 'manual', isAnonymous = false } = req.body;
    const userId = req.user._id;

    // Validate mood score
    if (!Number.isInteger(moodScore) || moodScore < 1 || moodScore > 5) {
      return res.status(400).json({ error: 'Mood score must be 1-5' });
    }

    const moodEntry = new MoodHistory({
      userId,
      moodScore,
      notes,
      sentiment: sentiment || (moodScore <= 2 ? 'negative' : moodScore >= 4 ? 'positive' : 'neutral'),
      detectedMood: req.body.detectedMood || 'neutral',
      triggers,
      checkinType,
      isAnonymous
    });

    await moodEntry.save();

    // Update user stats
    await User.findByIdAndUpdate(userId, {
      $set: {
        'moodStats.checkinsCount': await MoodHistory.countDocuments({ userId }),
        'moodStats.averageMood': await MoodHistory.aggregate([
          { $match: { userId } },
          { $group: { _id: null, avg: { $avg: '$moodScore' } } }
        ]).then(results => results[0]?.avg || 3),
        lastCheckinDate: new Date(),
        'moodStats.inCrisis': moodScore === 1 && notes?.toLowerCase().includes('suicide|hopeless|unable')
      }
    });

    res.json({
      success: true,
      moodId: moodEntry._id,
      message: 'Mood logged successfully! Keep tracking your wellness journey 💙'
    });

  } catch (error) {
    console.error('Mood log error:', error);
    res.status(500).json({ error: 'Failed to log mood' });
  }
};

// Daily wellness check-in
exports.dailyCheckin = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    const todayEntry = await MoodHistory.findOne({
      userId,
      createdAt: { $gte: today }
    });

    if (todayEntry) {
      return res.json({
        alreadyChecked: true,
        entry: todayEntry,
        message: 'You already did today\'s check-in! Great consistency! 🌟'
      });
    }

    // India timezone check-in prompt would be handled frontend
    res.json({
      prompt: 'How are you feeling today? Rate 1-5 (😢 Very Sad → 😊 Great)',
      helplines: moodScore <= 2 ? INDIA_HELPLINES.slice(0, 2) : []
    });

  } catch (error) {
    res.status(500).json({ error: 'Check-in failed' });
  }
};

// Get mood trends (dashboard)
exports.getMoodTrends = async (req, res) => {
  try {
    const userId = req.user._id;
    const days = parseInt(req.query.days) || 30;

    const trends = await MoodHistory.find({
      userId,
      createdAt: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) }
    })
    .sort({ createdAt: -1 })
    .select('moodScore notes sentiment createdAt detectedMood')
    .lean();

    // Compute aggregates
    const average = trends.reduce((sum, entry) => sum + entry.moodScore, 0) / trends.length || 3;
    const bestDay = Math.max(...trends.map(e => e.moodScore));
    const worstDay = Math.min(...trends.map(e => e.moodScore));

    res.json({
      trends,
      stats: {
        averageMood: Number(average.toFixed(1)),
        bestDay,
        worstDay,
        totalCheckins: trends.length,
        consistency: trends.length / days * 100
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
};

// Get India crisis helplines
exports.getHelplines = (req, res) => {
  res.json({ helplines: INDIA_HELPLINES });
};

// Quick mood insight (chat-triggered)
exports.analyzeMoodFromChat = async (req, res) => {
  // Called from chatController - delegates to Gemini
  // Returns detected sentiment for auto-logging
  res.json({ message: 'Integrated in chatController' });
};

