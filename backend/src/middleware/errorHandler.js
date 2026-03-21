// src/middleware/errorHandler.js

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // Log the full error server-side
  if (statusCode >= 500) {
    console.error(`❌ [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`, err);
  } else {
    console.warn(`⚠️ [${new Date().toISOString()}] ${req.method} ${req.originalUrl} — ${statusCode}: ${message}`);
  }

  // Map known error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  } else if (err.code === '23505') {
    // PostgreSQL unique constraint violation
    statusCode = 409;
    message = 'Resource already exists';
  } else if (err.code === '23503') {
    // PostgreSQL foreign key violation
    statusCode = 400;
    message = 'Referenced resource not found';
  }

  // Never expose internal error details in production
  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    message = 'Internal server error';
  }

  res.status(statusCode).json({
    success: false,
    error: message
  });
};

module.exports = { errorHandler, AppError };
