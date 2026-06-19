import { Router } from 'express';
import LeaderboardController from '../controllers/leaderboardController';
import { authenticate } from '../middleware/auth';

const router = Router();

// GET /api/leaderboard
router.get('/', authenticate, LeaderboardController.getLeaderboard);

// GET /api/leaderboard/history
router.get('/history', authenticate, LeaderboardController.getHistory);

// POST /api/leaderboard/archive
router.post('/archive', authenticate, LeaderboardController.archiveWinner);

export default router;
