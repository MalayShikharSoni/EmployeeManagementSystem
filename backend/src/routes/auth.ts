// src/routes/auth.ts
import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import AuthController from '../controllers/authController';
import { authenticate, requireRole } from '../middleware/auth';
import pool from '../config/database';
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Stricter, auth-specific rate limiting layered ON TOP of the global limiter
// (index.ts). Guards credential endpoints against brute-force. Counts by IP.
// skipSuccessfulRequests: a successful login/registration does NOT consume the
// budget, so only failed attempts count toward the limit — this protects
// against guessing without locking out legitimate users after a good login.
//
// Login and register each get their OWN limiter instance (independent internal
// counters/stores) so a failed register (often benign, e.g. "email already
// exists") cannot burn the login budget and lock a user out of signing in.
const createAuthLimiter = () => rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 FAILED attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: 'Too many attempts, please try again later'
    });
  }
});

const loginLimiter = createAuthLimiter();
const registerLimiter = createAuthLimiter();

const router = Router();

// Public routes (auth endpoints get their own stricter brute-force limiters)
router.post('/register', registerLimiter, AuthController.register);
router.post('/login', loginLimiter, AuthController.login);
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
