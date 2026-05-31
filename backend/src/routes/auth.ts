// src/routes/auth.ts
import { Router, Request, Response } from 'express';
import AuthController from '../controllers/authController';
import { authenticate, requireRole } from '../middleware/auth';
import pool from '../config/database';
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const router = Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refresh);

// Protected routes
router.get('/me', authenticate, AuthController.getMe);
router.post('/logout', authenticate, AuthController.logout);
router.put('/profile', authenticate, AuthController.updateProfile);
router.post('/avatar', authenticate, upload.single('avatar'), AuthController.uploadAvatar);

// Get team employees (admin only) — only employees who accepted this admin's invitation
router.get('/employees', authenticate, requireRole('admin'), async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = req.user.id;
    const result = await pool.query(
      `SELECT u.id, u.first_name, u.email, u.avatar_url, u.designation, u.department 
       FROM users u
       INNER JOIN team_invitations ti ON u.id = ti.employee_id
       WHERE ti.admin_id = $1 AND ti.status = 'accepted'
         AND u.role = 'employee' AND u.is_active = true 
       ORDER BY u.first_name`,
      [adminId]
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

export default router;
