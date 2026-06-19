import { Request, Response } from 'express';
import pool from '../config/database';
import User from '../models/userModel';

class EmployeeController {
  static async getEmployeeStats(req: Request, res: Response): Promise<void> {
    try {
      const employeeId = parseInt(req.params.employeeId as string);
      const requesterId = req.user.id;
      const requesterRole = req.user.role;

      if (isNaN(employeeId)) {
        res.status(400).json({ success: false, error: 'Invalid employee ID' });
        return;
      }

      // Authorization: Admin can view anyone, employee can only view themselves
      if (requesterRole === 'employee' && requesterId !== employeeId) {
        res.status(403).json({ success: false, error: 'Access denied' });
        return;
      }

      // Fetch user profile
      const employee = await User.findById(employeeId);
      if (!employee) {
        res.status(404).json({ success: false, error: 'Employee not found' });
        return;
      }

      // Fetch base counts
      const statsQuery = `
        SELECT 
          COUNT(*)::int as total_tasks,
          COALESCE(SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END), 0)::int as completed_tasks,
          COALESCE(SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END), 0)::int as failed_tasks,
          COALESCE(SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END), 0)::int as active_tasks,
          COALESCE(SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END), 0)::int as new_tasks,
          COALESCE(SUM(CASE WHEN status = 'completed' AND is_overdue = false THEN 1 ELSE 0 END), 0)::int as on_time_tasks,
          COALESCE(SUM(CASE WHEN status = 'completed' AND EXTRACT(MONTH FROM updated_at) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM updated_at) = EXTRACT(YEAR FROM CURRENT_DATE) THEN 1 ELSE 0 END), 0)::int as tasks_this_month
        FROM tasks 
        WHERE assigned_to = $1;
      `;
      const statsResult = await pool.query(statsQuery, [employeeId]);
      const stats = statsResult.rows[0];

      // Fetch monthly trend (last 6 months)
      const trendQuery = `
        SELECT 
          TO_CHAR(updated_at, 'Mon') as month,
          COUNT(*)::int as count
        FROM tasks
        WHERE assigned_to = $1 AND status = 'completed' AND updated_at >= CURRENT_DATE - INTERVAL '6 months'
        GROUP BY TO_CHAR(updated_at, 'Mon'), DATE_TRUNC('month', updated_at)
        ORDER BY DATE_TRUNC('month', updated_at);
      `;
      const trendResult = await pool.query(trendQuery, [employeeId]);
      
      // Ensure we have 6 months even if empty
      const monthlyTrend = trendResult.rows;

      // Fetch priority breakdown
      const priorityQuery = `
        SELECT priority, COUNT(*)::int as count
        FROM tasks
        WHERE assigned_to = $1
        GROUP BY priority;
      `;
      const priorityResult = await pool.query(priorityQuery, [employeeId]);

      // Current tasks
      const currentTasksQuery = `
        SELECT id, title, status, due_date, priority, is_overdue, 
        (SELECT COUNT(*)::int FROM task_comments tc WHERE tc.task_id = tasks.id) as comment_count
        FROM tasks
        WHERE assigned_to = $1 AND status IN ('new', 'active')
        ORDER BY created_at DESC;
      `;
      const currentTasksResult = await pool.query(currentTasksQuery, [employeeId]);

      // Calculate rates
      const completionRate = stats.total_tasks > 0 ? Math.round((stats.completed_tasks / stats.total_tasks) * 100) : 0;
      const onTimeRate = stats.completed_tasks > 0 ? Math.round((stats.on_time_tasks / stats.completed_tasks) * 100) : 0;

      // Return unified response
      res.json({
        success: true,
        data: {
          employee: {
            id: employee.id,
            first_name: employee.first_name,
            email: employee.email,
            avatar_url: employee.avatar_url,
            bio: employee.bio,
            phone: employee.phone,
            designation: employee.designation,
            department: employee.department,
            linkedin_url: employee.linkedin_url,
            created_at: employee.created_at
          },
          totalTasks: stats.total_tasks,
          completedTasks: stats.completed_tasks,
          failedTasks: stats.failed_tasks,
          activeTasks: stats.active_tasks,
          newTasks: stats.new_tasks,
          completionRate,
          onTimeRate,
          tasksThisMonth: stats.tasks_this_month,
          monthlyTrend,
          priorityBreakdown: priorityResult.rows,
          currentTasks: currentTasksResult.rows
        }
      });

    } catch (error) {
      console.error('Get employee stats error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch employee stats' });
    }
  }
}

export default EmployeeController;
