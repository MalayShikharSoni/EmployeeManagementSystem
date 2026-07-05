import { Router } from 'express';
import AnalyticsController from '../controllers/analyticsController';
import { authenticate } from '../middleware/auth';

const router = Router();

// GET /api/admin/analytics
router.get('/analytics', authenticate, AnalyticsController.getAnalytics);

export default router;
