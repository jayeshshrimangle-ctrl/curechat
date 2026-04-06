// ============================================
// Medicine Controller - Reminder Management
// Add, list, update, delete medicine schedules
// ============================================

const MedicineReminder = require('../models/MedicineReminder');

exports.addMedicine = async (req, res) => {
  try {
    const { name, dosage, frequency, time, duration, instructions } = req.body;
    const userId = req.user._id;

    const reminder = new MedicineReminder({
      userId,
      name,
      dosage,
      frequency,
      time,
      duration,
      instructions,
      nextDose: calculateNextDose(time, frequency)
    });

    await reminder.save();
    res.json({ success: true, reminder });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add medicine' });
  }
};

exports.getReminders = async (req, res) => {
  try {
    const userId = req.user._id;
    const reminders = await MedicineReminder.find({ userId, isActive: true })
      .sort({ nextDose: 1 })
      .lean();
    res.json({ reminders });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reminders' });
  }
};

exports.updateReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const updates = req.body;

    const reminder = await MedicineReminder.findOneAndUpdate(
      { _id: id, userId },
      updates,
      { new: true }
    );

    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }

    res.json({ success: true, reminder });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update' });
  }
};

exports.deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    await MedicineReminder.findOneAndDelete({ _id: id, userId });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete' });
  }
};

function calculateNextDose(time, frequency) {
  const now = new Date();
  const [hour, minute] = time.split(':').map(Number);
  const doseTime = new Date();
  doseTime.setHours(hour, minute, 0, 0);

  if (doseTime < now) {
    doseTime.setDate(doseTime.getDate() + 1);
  }

  return doseTime;
}

