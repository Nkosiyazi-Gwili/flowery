// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// CORS Configuration - Dynamic origins for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://your-flowery-app.vercel.app', // Replace with your actual Vercel URL
      'http://localhost:3000',
      'http://localhost:3001',
      'https://flowery-frontend.vercel.app', // Common Vercel pattern
      'https://flowery.vercel.app', // Another common pattern
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests globally
app.options('*', cors(corsOptions));

// Body parsing middleware with increased limits for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin} - IP: ${req.ip}`);
  next();
});

// Security headers middleware
app.use((req, res, next) => {
  // Remove specific headers that might reveal server information
  res.removeHeader('X-Powered-By');
  
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  next();
});

// Rate limiting (basic example - consider using express-rate-limit for production)
app.use((req, res, next) => {
  // Simple rate limiting - you might want to implement a more robust solution
  console.log(`Rate limit check for IP: ${req.ip}`);
  next();
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/products', require('./routes/products'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/vendors', require('./routes/vendors'));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Welcome to Flowery API 🌸',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Add this before your routes for testing
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is working!',
    timestamp: new Date().toISOString()
  });
});

// Health check route with detailed information
app.get('/api/health', (req, res) => {
  const healthCheck = {
    success: true,
    message: 'Flowery API is healthy 🚀',
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(2)} seconds`,
    environment: process.env.NODE_ENV || 'development',
    database: 'Connected', // You might want to add actual DB health check
    memory: {
      used: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
      total: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`
    }
  };
  
  res.json(healthCheck);
});

// API status route
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    service: 'Flowery Backend API',
    status: 'operational',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      products: '/api/products',
      orders: '/api/orders',
      admin: '/api/admin',
      vendors: '/api/vendors'
    }
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl,
    availableEndpoints: [
      '/api/auth',
      '/api/users', 
      '/api/products',
      '/api/orders',
      '/api/admin',
      '/api/vendors',
      '/api/health',
      '/api/status'
    ]
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err.stack);
  
  // CORS errors
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy: Origin not allowed',
      allowedOrigins: [
        'https://your-flowery-app.vercel.app',
        'http://localhost:3000'
      ]
    });
  }
  
  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors
    });
  }
  
  // Mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `Duplicate field value: ${field}`,
      error: `This ${field} already exists`
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }
  
  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', err);
  // Close server & exit process
  // process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception thrown:', err);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌸 Flowery Server running in ${process.env.NODE_ENV} mode`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 Health: http://localhost:${PORT}/api/health`);
  console.log(`📊 Status: http://localhost:${PORT}/api/status`);
  console.log(`🚀 Ready to receive requests!`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});