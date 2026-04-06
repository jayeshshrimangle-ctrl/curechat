// ============================================
// Appointment Routes - Vectorax Healthcare
// ============================================

const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, appointmentController.createAppointment);
router.get('/', authMiddleware, appointmentController.getAppointments);
router.put('/:id/cancel', authMiddleware, appointmentController.cancelAppointment);

module.exports = router;
