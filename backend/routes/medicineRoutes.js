// ============================================
// Medicine Reminder Routes
// ============================================

const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');
const authMiddleware = require('../middleware/authMiddleware');

// Add new medicine reminder
router.post('/', authMiddleware, medicineController.addMedicine);

// Get user reminders
router.get('/', authMiddleware, medicineController.getReminders);

// Update reminder
router.put('/:id', authMiddleware, medicineController.updateReminder);

// Delete reminder
router.delete('/:id', authMiddleware, medicineController.deleteReminder);

module.exports = router;


