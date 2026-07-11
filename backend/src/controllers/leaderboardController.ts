import { Request, Response } from 'express';
import LeaderboardModel from '../models/leaderboardModel';

class LeaderboardController {
  static async getLeaderboard(req: Request, res: Response): Promise<void> {
    try {
      // Must be an admin
      if (req.user.role !== 'admin') {
        res.status(403).json({ success: false, error: 'Access denied' });
        return;
      }
      
      const adminId = req.user.id;
      const leaderboard = await LeaderboardModel.getLiveLeaderboardSafe(adminId);
      
      res.json({
        success: true,
        data: leaderboard
      });
    } catch (error) {
      console.error('Get leaderboard error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch leaderboard' });
    }
  }

  static async getHistory(req: Request, res: Response): Promise<void> {
    try {
      if (req.user.role !== 'admin') {
        res.status(403).json({ success: false, error: 'Access denied' });
        return;
      }
      
      const adminId = req.user.id;
      const history = await LeaderboardModel.getHistory(adminId);
      
      res.json({
        success: true,
        data: history
      });
    } catch (error) {
      console.error('Get leaderboard history error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch leaderboard history' });
    }
  }

  static async archiveWinner(req: Request, res: Response): Promise<void> {
    try {
      if (req.user.role !== 'admin') {
        res.status(403).json({ success: false, error: 'Access denied' });
        return;
      }
      
      const adminId = req.user.id;
      const { employeeId } = req.body;

      // Only the target employee is accepted from the client. The score and
      // stats snapshot are recomputed server-side inside the model — any
      // client-supplied score/snapshot is deliberately ignored.
      if (!employeeId) {
        res.status(400).json({ success: false, error: 'Missing employeeId' });
        return;
      }

      const record = await LeaderboardModel.archiveWinner(adminId, employeeId);

      if (!record) {
        res.status(404).json({ success: false, error: 'Employee not found on your team leaderboard' });
        return;
      }

      res.json({
        success: true,
        data: record,
        message: 'Employee of the Month successfully crowned!'
      });
    } catch (error) {
      console.error('Archive EOM winner error:', error);
      res.status(500).json({ success: false, error: 'Failed to archive winner' });
    }
  }
}

export default LeaderboardController;
