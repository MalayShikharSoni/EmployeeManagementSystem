// src/controllers/authController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import pool from '../config/database';
import cloudinary from '../config/cloudinary';
import streamifier from 'streamifier';

class AuthController {
  static generateTokens(user: { id: number; email: string; role: string }) {
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }

  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, firstName, role } = req.body;

      // Validate role
      const validRoles = ['admin', 'employee'];
      const userRole = validRoles.includes(role) ? role : 'employee';

      // Check if user exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        res.status(400).json({
          success: false,
          error: 'Email already registered'
        });
        return;
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

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findByEmail(email);
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
        return;
      }

      // Verify password
      const isValid = await User.verifyPassword(password, user.password_hash);
      if (!isValid) {
        res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
        return;
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

  static async getMe(req: Request, res: Response): Promise<void> {
    try {
      const result = await pool.query(
        'SELECT id, email, first_name, role, bio, phone, designation, department, linkedin_url, avatar_url, created_at FROM users WHERE id = $1',
        [req.user.id]
      );

      const user = result.rows[0];

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
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

  static async refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          error: 'Refresh token is required'
        });
        return;
      }

      // Verify the JWT signature and expiry
      let decoded: { id: number };
      try {
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as { id: number };
      } catch {
        res.status(401).json({
          success: false,
          error: 'Invalid or expired refresh token'
        });
        return;
      }

      // Check the token exists in DB and hasn't been revoked
      const tokenResult = await pool.query(
        'SELECT * FROM refresh_tokens WHERE token = $1 AND user_id = $2 AND expires_at > NOW()',
        [refreshToken, decoded.id]
      );

      if (tokenResult.rows.length === 0) {
        res.status(401).json({
          success: false,
          error: 'Refresh token not found or expired'
        });
        return;
      }

      // Fetch the user to include current role/email in the new access token
      const userResult = await pool.query(
        'SELECT id, email, role FROM users WHERE id = $1',
        [decoded.id]
      );

      if (userResult.rows.length === 0) {
        res.status(401).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      const user = userResult.rows[0];

      // Issue a new access token (refresh token stays the same)
      const accessToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET as string,
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

  static async logout(req: Request, res: Response): Promise<void> {
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

  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const { first_name, bio, phone, designation, department, linkedin_url } = req.body;
      
      await User.updateProfile(req.user.id, {
        first_name, bio, phone, designation, department, linkedin_url
      });

      res.json({
        success: true,
        message: 'Profile updated successfully'
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update profile'
      });
    }
  }

  static async uploadAvatar(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, error: 'No file uploaded' });
        return;
      }

      // Stream to cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'workwave/avatars' },
        async (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            res.status(500).json({ success: false, error: 'Failed to upload image' });
            return;
          }

          if (result && result.secure_url) {
            await User.updateAvatar(req.user.id, result.secure_url);
            res.json({ success: true, data: { avatar_url: result.secure_url } });
          }
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

    } catch (error) {
      console.error('Avatar upload error:', error);
      res.status(500).json({ success: false, error: 'Upload failed' });
    }
  }
}

export default AuthController;
