// ============================================
// Appointment Controller - Vectorax Healthcare
// ============================================

const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// Create appointment
exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, patientName, patientEmail, patientPhone, date, time, type, symptoms } = req.body;

    // Verify doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found.' });
    }

    const appointment = new Appointment({
      userId: req.user._id,
      doctorId,
      patientName,
      patientEmail,
      patientPhone,
      date,
      time,
      type: type || 'online',
      symptoms: symptoms || ''
    });

    await appointment.save();

    res.status(201).json({
      message: 'Appointment booked successfully!',
      appointment: {
        ...appointment.toObject(),
        doctorName: doctor.name,
        doctorSpecialization: doctor.specialization
      }
    });
  } catch (error) {
    console.error('Appointment error:', error);
    res.status(500).json({ error: 'Failed to book appointment.' });
  }
};

// Get user appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id })
      .populate('doctorId', 'name specialization hospital location fee')
      .sort({ createdAt: -1 });

    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments.' });
  }
};

// Cancel appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id, status: 'pending' },
      { status: 'cancelled' },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found or cannot be cancelled.' });
    }

    res.json({ message: 'Appointment cancelled.', appointment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel appointment.' });
  }
};
