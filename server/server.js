const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from React build (Vite's default is 'dist')
app.use(express.static(path.join(__dirname, 'dist'))); // Change to 'build' if needed

app.use(cors({
  origin: [
    'https://languagelearningdep-2.onrender.com', // Render subdomain
    'https://wmicsports.com',                      // Your custom domain
    'http://localhost:5173',                       // Vite default
    'http://localhost:3000'                        // Localhost
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

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/languages', require('./routes/languages'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/units', require('./routes/units'));
app.use('/api/lessons', require('./routes/lessons'));
app.use('/api/vocabulary', require('./routes/vocabulary'));
app.use('/api/grammar', require('./routes/grammar'));
app.use('/api/phrases', require('./routes/phrases'));
app.use('/api/exercises', require('./routes/exercises'));

// Root endpoint (optional, could be replaced by SPA)
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

// ---- CLIENT-SIDE ROUTING FIX ----
// Serve index.html for any non-API, non-health route (for React Router refreshes)
app.get('*', (req, res, next) => {
  if (
    !req.originalUrl.startsWith('/api') &&
    !req.originalUrl.startsWith('/health')
  ) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html')); // Change to 'build' if needed
  } else {
    next();
  }
});

// ---- 404 HANDLER FOR API/HEALTH ONLY ----
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// ---- ERROR HANDLER ----
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// ---- START SERVER ----
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
