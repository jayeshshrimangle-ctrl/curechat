// ============================================
// Seed Doctors Data - Vectorax Healthcare
// ============================================

const Doctor = require('../models/Doctor');

const doctorsData = [
  {
    name: 'Dr. Priya Sharma',
    specialization: 'General Physician',
    qualification: 'MBBS, MD (Medicine)',
    experience: 12,
    hospital: 'Vectorax Medical Center',
    location: 'Mumbai, Maharashtra',
    fee: 500,
    rating: 4.8,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']
  },
  {
    name: 'Dr. Rajesh Kumar',
    specialization: 'Cardiologist',
    qualification: 'MBBS, DM (Cardiology)',
    experience: 18,
    hospital: 'Heart Care Hospital',
    location: 'Delhi, NCR',
    fee: 1200,
    rating: 4.9,
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    availableSlots: ['10:00 AM', '11:00 AM', '03:00 PM', '04:00 PM']
  },
  {
    name: 'Dr. Anjali Desai',
    specialization: 'Dermatologist',
    qualification: 'MBBS, MD (Dermatology)',
    experience: 8,
    hospital: 'Skin & Glow Clinic',
    location: 'Pune, Maharashtra',
    fee: 700,
    rating: 4.7,
    availableDays: ['Tuesday', 'Thursday', 'Saturday'],
    availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM']
  },
  {
    name: 'Dr. Vikram Singh',
    specialization: 'Orthopedic Surgeon',
    qualification: 'MBBS, MS (Orthopedics)',
    experience: 15,
    hospital: 'Bone & Joint Center',
    location: 'Bangalore, Karnataka',
    fee: 900,
    rating: 4.6,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
    availableSlots: ['09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']
  },
  {
    name: 'Dr. Meera Patel',
    specialization: 'Pediatrician',
    qualification: 'MBBS, MD (Pediatrics)',
    experience: 10,
    hospital: 'Children\'s Health Hospital',
    location: 'Ahmedabad, Gujarat',
    fee: 600,
    rating: 4.8,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM']
  },
  {
    name: 'Dr. Arjun Nair',
    specialization: 'Neurologist',
    qualification: 'MBBS, DM (Neurology)',
    experience: 20,
    hospital: 'NeuroScience Institute',
    location: 'Chennai, Tamil Nadu',
    fee: 1500,
    rating: 4.9,
    availableDays: ['Monday', 'Wednesday', 'Thursday'],
    availableSlots: ['10:00 AM', '11:00 AM', '03:00 PM']
  },
  {
    name: 'Dr. Sneha Kulkarni',
    specialization: 'Gynecologist',
    qualification: 'MBBS, MS (OB-GYN)',
    experience: 14,
    hospital: 'Women\'s Wellness Center',
    location: 'Hyderabad, Telangana',
    fee: 800,
    rating: 4.7,
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM']
  },
  {
    name: 'Dr. Rohan Mehta',
    specialization: 'Psychiatrist',
    qualification: 'MBBS, MD (Psychiatry)',
    experience: 11,
    hospital: 'Mind & Wellness Clinic',
    location: 'Mumbai, Maharashtra',
    fee: 1000,
    rating: 4.6,
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    availableSlots: ['10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM']
  },
  {
    name: 'Dr. Kavita Reddy',
    specialization: 'ENT Specialist',
    qualification: 'MBBS, MS (ENT)',
    experience: 9,
    hospital: 'ENT Care Center',
    location: 'Kolkata, West Bengal',
    fee: 650,
    rating: 4.5,
    availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
    availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '03:00 PM']
  },
  {
    name: 'Dr. Anil Gupta',
    specialization: 'Ophthalmologist',
    qualification: 'MBBS, MS (Ophthalmology)',
    experience: 16,
    hospital: 'Vision Eye Hospital',
    location: 'Jaipur, Rajasthan',
    fee: 750,
    rating: 4.7,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
    availableSlots: ['09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']
  },
  {
    name: 'Dr. Sunita Joshi',
    specialization: 'General Physician',
    qualification: 'MBBS, DNB (Medicine)',
    experience: 7,
    hospital: 'City Healthcare Center',
    location: 'Nagpur, Maharashtra',
    fee: 400,
    rating: 4.4,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM']
  },
  {
    name: 'Dr. Manish Verma',
    specialization: 'Dentist',
    qualification: 'BDS, MDS (Orthodontics)',
    experience: 13,
    hospital: 'Smile Dental Clinic',
    location: 'Lucknow, Uttar Pradesh',
    fee: 550,
    rating: 4.6,
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday'],
    availableSlots: ['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']
  }
];

const seedDoctors = async () => {
  try {
    const count = await Doctor.countDocuments();
    if (count === 0) {
      await Doctor.insertMany(doctorsData);
      console.log('✅ Doctors data seeded successfully');
    }
  } catch (error) {
    console.error('❌ Error seeding doctors:', error.message);
  }
};

module.exports = seedDoctors;
