// ============================================
// VECTORAX HEALTH CARE - Main Server
// ============================================

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const mentalHealthRoutes = require('./routes/mentalHealthRoutes');
const medicineRoutes = require('./routes/medicineRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ========================================
// CHECK REQUIRED ENVIRONMENT VARIABLES
// ========================================
console.log('🔍 Checking environment configuration...');

if (!process.env.GEMINI_API_KEY) {
  console.warn('⚠️  WARNING: GEMINI_API_KEY is not set in .env file');
  console.warn('⚠️  AI responses will use fallback mode only');
  console.warn('⚠️  Get your API key from: https://makersuite.google.com/app/apikey');
} else {
  console.log('✅ Gemini API Key found');
}

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set in .env file');
  process.exit(1);
} else {
  console.log('✅ MongoDB URI found');
}

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  WARNING: JWT_SECRET is using default value. Change this in production!');
}

// ========================================
// MIDDLEWARE
// ========================================
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5500'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.url}`);
  next();
});

// ========================================
// STATIC FILES
// ========================================
// Serve static frontend files
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use('/css', express.static(path.join(__dirname, '..', 'frontend', 'css')));
app.use('/js', express.static(path.join(__dirname, '..', 'frontend', 'js')));
app.use('/images', express.static(path.join(__dirname, '..', 'frontend', 'images')));

// ========================================
// API ROUTES
// ========================================
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/mental', mentalHealthRoutes);
app.use('/api/medicine', medicineRoutes);

// ========================================
// FRONTEND ROUTES
// ========================================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'chat.html'));
});

app.get('/doctors', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'doctor.html'));
});

app.get('/appointment', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'appointment.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'register.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dashboard.html'));
});

// ========================================
// HEALTH CHECK ENDPOINT
// ========================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      gemini: process.env.GEMINI_API_KEY ? 'configured' : 'missing',
      jwt: process.env.JWT_SECRET ? 'configured' : 'missing'
    }
  });
});

// ========================================
// ERROR HANDLING MIDDLEWARE
// ========================================
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '..', 'frontend', '404.html'));
});

// ========================================
// DATABASE CONNECTION & SERVER START
// ========================================
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully');
  console.log(`📊 Database: ${mongoose.connection.name}`);
  
  // Seed doctors data (optional)
  try {
    const seedDoctors = require('./seed/seedDoctors');
    seedDoctors();
    console.log('🌱 Doctor seeding completed');
  } catch (seedError) {
    console.log('ℹ️  Doctor seeding skipped (no seed file found)');
  }
  
  // Start server
  app.listen(PORT, () => {
    console.log('=' .repeat(50));
    console.log(`🚀 Vectorax Healthcare Server Running!`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`💬 Chat: http://localhost:${PORT}/chat`);
    console.log(`🩺 Doctors: http://localhost:${PORT}/doctors`);
    console.log(`📅 Appointments: http://localhost:${PORT}/appointment`);
    console.log(`🔑 Login: http://localhost:${PORT}/login`);
    console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
    console.log('=' .repeat(50));
  });
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  console.log('⚠️  Please make sure:');
  console.log('   1. MongoDB is installed and running');
  console.log('   2. MongoDB URI is correct in .env file');
  console.log('   3. MongoDB service is started:');
  console.log('      - Windows: net start MongoDB');
  console.log('      - Mac: brew services start mongodb-community');
  console.log('      - Linux: sudo systemctl start mongod');
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  mongoose.connection.close(() => {
    console.log('📦 MongoDB connection closed');
    process.exit(0);
  });
});