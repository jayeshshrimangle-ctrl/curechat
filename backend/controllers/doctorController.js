// ============================================
// Doctor Controller - Vectorax Healthcare
// ============================================

const Doctor = require('../models/Doctor');

// Get all doctors
exports.getDoctors = async (req, res) => {
  try {
    const { specialization, search } = req.query;
    let filter = { isAvailable: true };

    if (specialization && specialization !== 'all') {
      filter.specialization = new RegExp(specialization, 'i');
    }

    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { specialization: new RegExp(search, 'i') },
        { hospital: new RegExp(search, 'i') },
        { location: new RegExp(search, 'i') }
      ];
    }

    const doctors = await Doctor.find(filter).sort({ rating: -1 });
    res.json({ doctors });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch doctors.' });
  }
};

// Get single doctor
exports.getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found.' });
    }
    res.json({ doctor });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch doctor details.' });
  }
};

// Get specializations list
exports.getSpecializations = async (req, res) => {
  try {
    const specializations = await Doctor.distinct('specialization');
    res.json({ specializations });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch specializations.' });
  }
};
