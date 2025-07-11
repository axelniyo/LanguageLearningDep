const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Import routes
const languagesRouter = require('./routes/languages');
const coursesRouter = require('./routes/courses');
const unitsRouter = require('./routes/units');
const lessonsRouter = require('./routes/lessons');
const authRouter = require('./routes/auth');

// Middleware
app.use(cors({
  origin: [
  'https://languagelearningdep-2.onrender.com', // Your frontend URL
    'http://localhost:5173', // Vite default
    'http://localhost:3000' 
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Language Learning API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Auth routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/languages', require('./routes/languages'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/units', require('./routes/units'));
app.use('/api/lessons', require('./routes/lessons'));
app.use('/api/vocabulary', require('./routes/vocabulary'));
app.use('/api/grammar', require('./routes/grammar'));
app.use('/api/phrases', require('./routes/phrases'));
app.use('/api/exercises', require('./routes/exercises'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Language Learning API - XAMPP Ready!',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      languages: '/api/languages',
      courses: '/api/courses',
      units: '/api/units',
      lessons: '/api/lessons',
      vocabulary: '/api/vocabulary',
      grammar: '/api/grammar',
      phrases: '/api/phrases',
      exercises: '/api/exercises'
    },
    documentation: 'Connect your React app to this API',
    database: 'XAMPP MariaDB'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 ================================');
  console.log(`🚀 Language Learning API Server`);
  console.log(`🚀 Running on: http://localhost:${PORT}`);
  console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🚀 Database: XAMPP MariaDB`);
  console.log('🚀 ================================');
  console.log('📡 API Endpoints:');
  console.log(`   GET  /health`);
  console.log(`   POST /api/auth/signup`);
  console.log(`   POST /api/auth/signin`);
  console.log(`   POST /api/auth/signout`);
  console.log(`   GET  /api/languages`);
  console.log(`   GET  /api/courses`);
  console.log(`   GET  /api/units`);
  console.log(`   GET  /api/lessons`);
  console.log(`   GET  /api/vocabulary`);
  console.log(`   GET  /api/grammar`);
  console.log(`   GET  /api/phrases`);
  console.log(`   GET  /api/exercises`);
  console.log('🚀 ================================');
});

module.exports = app;
const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);
