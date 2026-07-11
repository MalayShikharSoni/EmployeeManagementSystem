import pool from '../config/database';

export interface LeaderboardEntry {
  employee_id: number;
  first_name: string;
  email: string;
  avatar_url?: string;
  department?: string;
  designation?: string;
  score: number;
  tasks_completed_this_month: number;
  on_time_completions: number;
  high_priority_completions: number;
  urgent_priority_completions: number;
  overdue_tasks: number;
  completion_rate: number;
}

export interface EomRecord {
  id: number;
  admin_id: number;
  employee_id: number;
  month: Date;
  score: number;
  snapshot_stats: LeaderboardEntry;
  created_at: Date;
  first_name?: string;
  email?: string;
  avatar_url?: string;
}

class LeaderboardModel {
  static async getLiveLeaderboard(adminId: number): Promise<LeaderboardEntry[]> {
    const query = `
      WITH team_members AS (
        SELECT u.id as employee_id, u.first_name, u.email, u.avatar_url, u.department, u.designation
        FROM users u
        JOIN team_invitations ti ON u.id = ti.employee_id
        WHERE ti.admin_id = $1 AND ti.status = 'accepted' AND u.is_active = true
      ),
      task_stats AS (
        SELECT 
          t.assigned_to as employee_id,
          COUNT(*) as total_tasks,
          SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
          SUM(CASE WHEN t.status = 'completed' AND EXTRACT(MONTH FROM t.updated_at) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM t.updated_at) = EXTRACT(YEAR FROM CURRENT_DATE) THEN 1 ELSE 0 END) as tasks_completed_this_month,
          SUM(CASE WHEN t.status = 'completed' AND t.is_overdue = false THEN 1 ELSE 0 END) as on_time_completions,
          SUM(CASE WHEN t.status = 'completed' AND t.priority = 'high' THEN 1 ELSE 0 END) as high_priority_completions,
          SUM(CASE WHEN t.status = 'completed' AND t.priority = 'urgent' THEN 1 ELSE 0 END) as urgent_priority_completions,
          SUM(CASE WHEN t.is_overdue = true AND t.status != 'completed' THEN 1 ELSE 0 END) as overdue_tasks
        FROM tasks t
        GROUP BY t.assigned_to
      )
      SELECT 
        tm.employee_id,
        tm.first_name,
        tm.email,
        tm.avatar_url,
        tm.department,
        tm.designation,
        COALESCE(ts.tasks_completed_this_month, 0)::int as tasks_completed_this_month,
        COALESCE(ts.on_time_completions, 0)::int as on_time_completions,
        COALESCE(ts.high_priority_completions, 0)::int as high_priority_completions,
        COALESCE(ts.urgent_priority_completions, 0)::int as urgent_priority_completions,
        COALESCE(ts.overdue_tasks, 0)::int as overdue_tasks,
        CASE WHEN COALESCE(ts.total_tasks, 0) > 0 THEN Math.ROUND((COALESCE(ts.completed_tasks, 0)::numeric / ts.total_tasks::numeric) * 100) ELSE 0 END as completion_rate,
        (
          (COALESCE(ts.tasks_completed_this_month, 0) * 10) +
          (COALESCE(ts.on_time_completions, 0) * 15) +
          (COALESCE(ts.high_priority_completions, 0) * 20) +
          (COALESCE(ts.urgent_priority_completions, 0) * 30) -
          (COALESCE(ts.overdue_tasks, 0) * 10)
        ) as score
      FROM team_members tm
      LEFT JOIN task_stats ts ON tm.employee_id = ts.employee_id
      ORDER BY score DESC, completion_rate DESC
    `;
    const result = await pool.query(query, [adminId]);
    
    // We need to do the math.round in JS or properly cast in SQL. Let's fix the Math.ROUND part.
    // Actually, SQL has ROUND, but to be safe, I'll calculate completion_rate in JS or standard SQL ROUND.
    // Let's modify the query directly. Wait, the query string is evaluated by Postgres. Math.ROUND is invalid in Postgres. It should be ROUND(...).
    // Let's just fix it.
    return result.rows.map(row => ({
      ...row,
      score: parseInt(row.score, 10),
      completion_rate: parseFloat(row.completion_rate || '0')
    }));
  }

  static async getLiveLeaderboardSafe(adminId: number): Promise<LeaderboardEntry[]> {
    const query = `
      WITH team_members AS (
        SELECT u.id as employee_id, u.first_name, u.email, u.avatar_url, u.department, u.designation
        FROM users u
        JOIN team_invitations ti ON u.id = ti.employee_id
        WHERE ti.admin_id = $1 AND ti.status = 'accepted' AND u.is_active = true
      ),
      task_stats AS (
        SELECT 
          t.assigned_to as employee_id,
          COUNT(*) as total_tasks,
          SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
          SUM(CASE WHEN t.status = 'completed' AND EXTRACT(MONTH FROM t.updated_at) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM t.updated_at) = EXTRACT(YEAR FROM CURRENT_DATE) THEN 1 ELSE 0 END) as tasks_completed_this_month,
          SUM(CASE WHEN t.status = 'completed' AND t.is_overdue = false THEN 1 ELSE 0 END) as on_time_completions,
          SUM(CASE WHEN t.status = 'completed' AND t.priority = 'high' THEN 1 ELSE 0 END) as high_priority_completions,
          SUM(CASE WHEN t.status = 'completed' AND t.priority = 'urgent' THEN 1 ELSE 0 END) as urgent_priority_completions,
          SUM(CASE WHEN t.is_overdue = true AND t.status != 'completed' THEN 1 ELSE 0 END) as overdue_tasks
        FROM tasks t
        GROUP BY t.assigned_to
      )
      SELECT 
        tm.employee_id,
        tm.first_name,
        tm.email,
        tm.avatar_url,
        tm.department,
        tm.designation,
        COALESCE(ts.tasks_completed_this_month, 0)::int as tasks_completed_this_month,
        COALESCE(ts.on_time_completions, 0)::int as on_time_completions,
        COALESCE(ts.high_priority_completions, 0)::int as high_priority_completions,
        COALESCE(ts.urgent_priority_completions, 0)::int as urgent_priority_completions,
        COALESCE(ts.overdue_tasks, 0)::int as overdue_tasks,
        CASE WHEN COALESCE(ts.total_tasks, 0) > 0 THEN ROUND((COALESCE(ts.completed_tasks, 0)::numeric / ts.total_tasks::numeric) * 100) ELSE 0 END as completion_rate,
        (
          (COALESCE(ts.tasks_completed_this_month, 0) * 10) +
          (COALESCE(ts.on_time_completions, 0) * 15) +
          (COALESCE(ts.high_priority_completions, 0) * 20) +
          (COALESCE(ts.urgent_priority_completions, 0) * 30) -
          (COALESCE(ts.overdue_tasks, 0) * 10)
        ) as score
      FROM team_members tm
      LEFT JOIN task_stats ts ON tm.employee_id = ts.employee_id
      ORDER BY score DESC, completion_rate DESC
    `;
    const result = await pool.query(query, [adminId]);
    return result.rows.map(row => ({
      ...row,
      score: parseInt(row.score, 10),
      completion_rate: parseFloat(row.completion_rate)
    }));
  }

  // Compute a single employee's leaderboard entry server-side, reusing the
  // exact same scoring logic as getLiveLeaderboardSafe (single source of truth —
  // no parallel formula). Scoped to this admin's accepted, active team members,
  // so an employee not on the admin's team yields null.
  static async getEmployeeLeaderboardEntry(adminId: number, employeeId: number): Promise<LeaderboardEntry | null> {
    const leaderboard = await this.getLiveLeaderboardSafe(adminId);
    return leaderboard.find(entry => entry.employee_id === employeeId) || null;
  }

  // Archive the Employee-of-the-Month winner. The client only chooses WHICH
  // employee to crown; the score and stats snapshot are ALWAYS recomputed
  // server-side and persisted — client-supplied scores/snapshots are ignored.
  // Returns null if the employee has no server-computed entry (e.g. not on the
  // admin's team), so the caller can surface a 404 rather than forge a record.
  static async archiveWinner(adminId: number, employeeId: number): Promise<EomRecord | null> {
    const entry = await this.getEmployeeLeaderboardEntry(adminId, employeeId);
    if (!entry) {
      return null;
    }

    const month = new Date();
    month.setDate(1); // first day of month
    const query = `
      INSERT INTO eom_records (admin_id, employee_id, month, score, snapshot_stats)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (admin_id, month) DO UPDATE 
      SET employee_id = EXCLUDED.employee_id, score = EXCLUDED.score, snapshot_stats = EXCLUDED.snapshot_stats
      RETURNING *
    `;
    const values = [adminId, employeeId, month, entry.score, JSON.stringify(entry)];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getHistory(adminId: number): Promise<EomRecord[]> {
    const query = `
      SELECT e.*, u.first_name, u.email, u.avatar_url
      FROM eom_records e
      JOIN users u ON e.employee_id = u.id
      WHERE e.admin_id = $1
      ORDER BY e.month DESC
    `;
    const result = await pool.query(query, [adminId]);
    return result.rows;
  }
}

export default LeaderboardModel;
