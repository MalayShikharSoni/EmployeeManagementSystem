// src/controllers/authController.js
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

class AuthController {
  static generateTokens(user) {
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }

  static async register(req, res) {
    try {
      const { email, password, firstName, role } = req.body;

      // Validate role
      const validRoles = ['admin', 'employee'];
      const userRole = validRoles.includes(role) ? role : 'employee';

      // Check if user exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Email already registered'
        });
      }

      // Create user
      const user = await User.create({ email, password, firstName, role: userRole });

      // Generate tokens
      const { accessToken, refreshToken } = AuthController.generateTokens(user);

      // Store refresh token
      await pool.query(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'7 days\')',
        [user.id, refreshToken]
      );

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            role: user.role
          },
          accessToken,
          refreshToken
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: 'Registration failed'
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Verify password
      const isValid = await User.verifyPassword(password, user.password_hash);
      if (!isValid) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Update last login
      await User.updateLastLogin(user.id);

      // Generate tokens
      const { accessToken, refreshToken } = AuthController.generateTokens(user);

      // Store refresh token
      await pool.query(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'7 days\')',
        [user.id, refreshToken]
      );

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            role: user.role
          },
          accessToken,
          refreshToken
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Login failed'
      });
    }
  }

  // Add this method to your AuthController class
  static async getMe(req, res) {
    try {
      const pool = require('../config/database');
      const result = await pool.query(
        'SELECT id, email, first_name, role, created_at FROM users WHERE id = $1',
        [req.user.id]
      );

      const user = result.rows[0];

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Get me error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user'
      });
    }
  }

  static async refresh(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: 'Refresh token is required'
        });
      }

      // Verify the JWT signature and expiry
      let decoded;
      try {
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      } catch (err) {
        return res.status(401).json({
          success: false,
          error: 'Invalid or expired refresh token'
        });
      }

      // Check the token exists in DB and hasn't been revoked
      const tokenResult = await pool.query(
        'SELECT * FROM refresh_tokens WHERE token = $1 AND user_id = $2 AND expires_at > NOW()',
        [refreshToken, decoded.id]
      );

      if (tokenResult.rows.length === 0) {
        return res.status(401).json({
          success: false,
          error: 'Refresh token not found or expired'
        });
      }

      // Fetch the user to include current role/email in the new access token
      const userResult = await pool.query(
        'SELECT id, email, role FROM users WHERE id = $1',
        [decoded.id]
      );

      if (userResult.rows.length === 0) {
        return res.status(401).json({
          success: false,
          error: 'User not found'
        });
      }

      const user = userResult.rows[0];

      // Issue a new access token (refresh token stays the same)
      const accessToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      res.json({
        success: true,
        data: { accessToken }
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(500).json({
        success: false,
        error: 'Token refresh failed'
      });
    }
  }

  static async logout(req, res) {
    try {
      const { refreshToken } = req.body;

      if (refreshToken) {
        // Delete the specific refresh token from DB
        await pool.query(
          'DELETE FROM refresh_tokens WHERE token = $1 AND user_id = $2',
          [refreshToken, req.user.id]
        );
      } else {
        // If no token provided, revoke ALL refresh tokens for this user
        await pool.query(
          'DELETE FROM refresh_tokens WHERE user_id = $1',
          [req.user.id]
        );
      }

      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        error: 'Logout failed'
      });
    }
  }

}

module.exports = AuthController;