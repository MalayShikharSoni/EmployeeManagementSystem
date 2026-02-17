const express = require('express');
const AuthController = require('../controllers/authController');
const { authenticate, requireRole } = require('../middleware/auth');
const pool = require('../config/database');

const router = express.Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Protected routes
router.get('/me', authenticate, AuthController.getMe);

// Get all employees (admin only)
router.get('/employees', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, first_name, email 
       FROM users 
       WHERE role = 'employee' AND is_active = true 
       ORDER BY first_name`
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch employees'
    });
  }
});

module.exports = router;