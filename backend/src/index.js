// src/index.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const invitationRoutes = require('./routes/invitations');
const { errorHandler } = require('./middleware/errorHandler');
require('dotenv').config();

const app = express();

// Trust proxy (required for Render, which runs behind a reverse proxy)
app.set('trust proxy', 1);

// CORS must be before helmet so preflight OPTIONS requests work
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://workwave-six.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security middleware
app.use(helmet());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/invitations', invitationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// 404 catch-all for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Centralized error handler (must be after all routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});