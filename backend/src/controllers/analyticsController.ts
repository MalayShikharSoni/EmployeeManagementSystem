import { Request, Response } from 'express';
import pool from '../config/database';

class AnalyticsController {
  // GET /api/admin/analytics — birds-eye view for admin
  static async getAnalytics(req: Request, res: Response): Promise<void> {
    try {
      if (req.user.role !== 'admin') {
        res.status(403).json({ success: false, error: 'Access denied' });
        return;
      }

      const adminId = req.user.id;

      // Total team members (accepted invitations)
      const teamCountResult = await pool.query(
        `SELECT COUNT(DISTINCT employee_id)::int as count 
         FROM team_invitations 
         WHERE admin_id = $1 AND status = 'accepted'`,
        [adminId]
      );
      const totalTeamMembers = teamCountResult.rows[0]?.count || 0;

      // Tasks assigned this month (by this admin)
      const tasksThisMonthResult = await pool.query(
        `SELECT COUNT(*)::int as count
         FROM tasks
         WHERE created_by = $1
           AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
           AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)`,
        [adminId]
      );
      const tasksAssignedThisMonth = tasksThisMonthResult.rows[0]?.count || 0;

      // Overall task stats (all tasks by this admin)
      const overallStatsResult = await pool.query(
        `SELECT 
           COUNT(*)::int as total_tasks,
           COALESCE(SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END), 0)::int as completed,
           COALESCE(SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END), 0)::int as active,
           COALESCE(SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END), 0)::int as new_tasks,
           COALESCE(SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END), 0)::int as failed,
           COALESCE(SUM(CASE WHEN is_overdue = true AND status NOT IN ('completed', 'failed') THEN 1 ELSE 0 END), 0)::int as overdue
         FROM tasks
         WHERE created_by = $1`,
        [adminId]
      );
      const overall = overallStatsResult.rows[0];
      const completionRate = overall.total_tasks > 0
        ? Math.round((overall.completed / overall.total_tasks) * 100)
        : 0;

      // Tasks by status
      const tasksByStatus = {
        new: overall.new_tasks,
        active: overall.active,
        completed: overall.completed,
        failed: overall.failed,
      };

      // Tasks by priority
      const priorityResult = await pool.query(
        `SELECT priority, COUNT(*)::int as count
         FROM tasks WHERE created_by = $1
         GROUP BY priority ORDER BY priority`,
        [adminId]
      );
      const tasksByPriority = priorityResult.rows;

      // Most active employee this month (most completions)
      const mostActiveResult = await pool.query(
        `SELECT u.id, u.first_name, u.email, u.avatar_url, COUNT(*)::int as completed_count
         FROM tasks t
         JOIN users u ON t.assigned_to = u.id
         WHERE t.created_by = $1
           AND t.status = 'completed'
           AND EXTRACT(MONTH FROM t.updated_at) = EXTRACT(MONTH FROM CURRENT_DATE)
           AND EXTRACT(YEAR FROM t.updated_at) = EXTRACT(YEAR FROM CURRENT_DATE)
         GROUP BY u.id, u.first_name, u.email, u.avatar_url
         ORDER BY completed_count DESC
         LIMIT 1`,
        [adminId]
      );
      const mostActiveEmployee = mostActiveResult.rows[0] || null;

      // Tasks completed per day (last 30 days)
      const dailyCompletionsResult = await pool.query(
        `SELECT 
           d.date::text as date,
           COALESCE(COUNT(t.id), 0)::int as count
         FROM generate_series(
           CURRENT_DATE - INTERVAL '29 days',
           CURRENT_DATE,
           '1 day'
         ) AS d(date)
         LEFT JOIN tasks t ON DATE(t.updated_at) = d.date 
           AND t.status = 'completed' 
           AND t.created_by = $1
         GROUP BY d.date
         ORDER BY d.date ASC`,
        [adminId]
      );
      const completionsPerDay = dailyCompletionsResult.rows;

      // Per-employee task completions this month
      const perEmployeeResult = await pool.query(
        `SELECT u.first_name, u.email, u.avatar_url,
           COUNT(*)::int as total_tasks,
           COALESCE(SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END), 0)::int as completed
         FROM tasks t
         JOIN users u ON t.assigned_to = u.id
         WHERE t.created_by = $1
           AND EXTRACT(MONTH FROM t.created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
           AND EXTRACT(YEAR FROM t.created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
         GROUP BY u.first_name, u.email, u.avatar_url
         ORDER BY completed DESC`,
        [adminId]
      );
      const perEmployeeStats = perEmployeeResult.rows;

      // Average completion time (in days)
      const avgTimeResult = await pool.query(
        `SELECT ROUND(AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) / 86400)::numeric, 1) as avg_days
         FROM tasks
         WHERE created_by = $1 AND status = 'completed'`,
        [adminId]
      );
      const avgCompletionDays = parseFloat(avgTimeResult.rows[0]?.avg_days) || 0;

      res.json({
        success: true,
        data: {
          totalTeamMembers,
          tasksAssignedThisMonth,
          totalTasks: overall.total_tasks,
          completionRate,
          overdueCount: overall.overdue,
          avgCompletionDays,
          tasksByStatus,
          tasksByPriority,
          mostActiveEmployee,
          completionsPerDay,
          perEmployeeStats,
        },
      });
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch analytics' });
    }
  }
}

export default AnalyticsController;
