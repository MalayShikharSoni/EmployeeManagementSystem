import pool from '../config/database';

export interface ProjectGroup {
  id: number;
  name: string;
  description: string | null;
  admin_id: number;
  github_repo_url: string | null;
  status: 'active' | 'completed' | 'archived';
  created_at: Date;
  updated_at: Date;
  member_count?: number;
  task_count?: number;
  completed_task_count?: number;
}

export interface ProjectGroupMember {
  id: number;
  group_id: number;
  employee_id: number;
  role_in_group: string | null;
  joined_at: Date;
  first_name?: string;
  email?: string;
  avatar_url?: string;
  designation?: string;
}

export interface ProjectTask {
  id: number;
  group_id: number;
  assigned_to: number;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  due_date: Date | null;
  is_overdue: boolean;
  created_at: Date;
  updated_at: Date;
  assignee_name?: string;
  assignee_email?: string;
  assignee_avatar?: string;
}

export interface MemberProgress {
  employee_id: number;
  first_name: string;
  email: string;
  avatar_url: string | null;
  total_tasks: number;
  completed_tasks: number;
  active_tasks: number;
  new_tasks: number;
  failed_tasks: number;
  completion_rate: number;
}

class GroupModel {
  static async create(
    name: string,
    description: string | null,
    adminId: number,
    githubRepoUrl: string | null,
    memberIds: number[]
  ): Promise<ProjectGroup> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const groupResult = await client.query(
        `INSERT INTO project_groups (name, description, admin_id, github_repo_url)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [name, description, adminId, githubRepoUrl]
      );
      const group = groupResult.rows[0];

      // Insert members
      for (const employeeId of memberIds) {
        await client.query(
          `INSERT INTO project_group_members (group_id, employee_id)
           VALUES ($1, $2)
           ON CONFLICT (group_id, employee_id) DO NOTHING`,
          [group.id, employeeId]
        );
      }

      await client.query('COMMIT');
      return group;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async getGroupsByAdmin(adminId: number): Promise<ProjectGroup[]> {
    const result = await pool.query(
      `SELECT pg.*,
        (SELECT COUNT(*) FROM project_group_members pgm WHERE pgm.group_id = pg.id)::int as member_count,
        (SELECT COUNT(*) FROM project_tasks pt WHERE pt.group_id = pg.id)::int as task_count,
        (SELECT COUNT(*) FROM project_tasks pt WHERE pt.group_id = pg.id AND pt.status = 'completed')::int as completed_task_count
      FROM project_groups pg
      WHERE pg.admin_id = $1
      ORDER BY pg.created_at DESC`,
      [adminId]
    );
    return result.rows;
  }

  static async getGroupsByEmployee(employeeId: number): Promise<ProjectGroup[]> {
    const result = await pool.query(
      `SELECT pg.*,
        (SELECT COUNT(*) FROM project_group_members pgm WHERE pgm.group_id = pg.id)::int as member_count,
        (SELECT COUNT(*) FROM project_tasks pt WHERE pt.group_id = pg.id)::int as task_count,
        (SELECT COUNT(*) FROM project_tasks pt WHERE pt.group_id = pg.id AND pt.status = 'completed')::int as completed_task_count
      FROM project_groups pg
      JOIN project_group_members pgm ON pg.id = pgm.group_id
      WHERE pgm.employee_id = $1
      ORDER BY pg.created_at DESC`,
      [employeeId]
    );
    return result.rows;
  }

  static async getGroupDetail(groupId: number): Promise<ProjectGroup | null> {
    const result = await pool.query(
      `SELECT pg.*,
        (SELECT COUNT(*) FROM project_group_members pgm WHERE pgm.group_id = pg.id)::int as member_count,
        (SELECT COUNT(*) FROM project_tasks pt WHERE pt.group_id = pg.id)::int as task_count,
        (SELECT COUNT(*) FROM project_tasks pt WHERE pt.group_id = pg.id AND pt.status = 'completed')::int as completed_task_count
      FROM project_groups pg
      WHERE pg.id = $1`,
      [groupId]
    );
    return result.rows[0] || null;
  }

  static async getGroupMembers(groupId: number): Promise<ProjectGroupMember[]> {
    const result = await pool.query(
      `SELECT pgm.*, u.first_name, u.email, u.avatar_url, u.designation
      FROM project_group_members pgm
      JOIN users u ON pgm.employee_id = u.id
      WHERE pgm.group_id = $1
      ORDER BY pgm.joined_at ASC`,
      [groupId]
    );
    return result.rows;
  }

  static async createTask(
    groupId: number,
    assignedTo: number,
    title: string,
    description: string | null,
    priority: string,
    dueDate: string | null
  ): Promise<ProjectTask> {
    const result = await pool.query(
      `INSERT INTO project_tasks (group_id, assigned_to, title, description, priority, due_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [groupId, assignedTo, title, description, priority, dueDate]
    );
    return result.rows[0];
  }

  static async getGroupTasks(groupId: number): Promise<ProjectTask[]> {
    const result = await pool.query(
      `SELECT pt.*, u.first_name as assignee_name, u.email as assignee_email, u.avatar_url as assignee_avatar
      FROM project_tasks pt
      JOIN users u ON pt.assigned_to = u.id
      WHERE pt.group_id = $1
      ORDER BY pt.created_at DESC`,
      [groupId]
    );
    return result.rows;
  }

  static async getGroupProgress(groupId: number): Promise<MemberProgress[]> {
    const result = await pool.query(
      `SELECT
        pgm.employee_id,
        u.first_name,
        u.email,
        u.avatar_url,
        COUNT(pt.id)::int as total_tasks,
        SUM(CASE WHEN pt.status = 'completed' THEN 1 ELSE 0 END)::int as completed_tasks,
        SUM(CASE WHEN pt.status = 'active' THEN 1 ELSE 0 END)::int as active_tasks,
        SUM(CASE WHEN pt.status = 'new' THEN 1 ELSE 0 END)::int as new_tasks,
        SUM(CASE WHEN pt.status = 'failed' THEN 1 ELSE 0 END)::int as failed_tasks,
        CASE WHEN COUNT(pt.id) > 0 
          THEN ROUND((SUM(CASE WHEN pt.status = 'completed' THEN 1 ELSE 0 END)::numeric / COUNT(pt.id)::numeric) * 100)
          ELSE 0
        END::int as completion_rate
      FROM project_group_members pgm
      JOIN users u ON pgm.employee_id = u.id
      LEFT JOIN project_tasks pt ON pt.group_id = pgm.group_id AND pt.assigned_to = pgm.employee_id
      WHERE pgm.group_id = $1
      GROUP BY pgm.employee_id, u.first_name, u.email, u.avatar_url
      ORDER BY completed_tasks DESC, total_tasks DESC`,
      [groupId]
    );
    return result.rows;
  }

  static async updateGithubUrl(groupId: number, githubRepoUrl: string | null): Promise<ProjectGroup | null> {
    const result = await pool.query(
      `UPDATE project_groups SET github_repo_url = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [githubRepoUrl, groupId]
    );
    return result.rows[0] || null;
  }

  static async updateTaskStatus(taskId: number, status: string): Promise<ProjectTask | null> {
    const result = await pool.query(
      `UPDATE project_tasks SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [status, taskId]
    );
    return result.rows[0] || null;
  }

  static async isGroupAdmin(groupId: number, userId: number): Promise<boolean> {
    const result = await pool.query(
      `SELECT 1 FROM project_groups WHERE id = $1 AND admin_id = $2`,
      [groupId, userId]
    );
    return result.rows.length > 0;
  }

  static async isGroupMember(groupId: number, userId: number): Promise<boolean> {
    const result = await pool.query(
      `SELECT 1 FROM project_group_members WHERE group_id = $1 AND employee_id = $2`,
      [groupId, userId]
    );
    return result.rows.length > 0;
  }

  static async getEmployeeGroupTasks(employeeId: number): Promise<{ group_name: string; group_id: number; tasks: ProjectTask[] }[]> {
    const groupsResult = await pool.query(
      `SELECT pg.id, pg.name
      FROM project_groups pg
      JOIN project_group_members pgm ON pg.id = pgm.group_id
      WHERE pgm.employee_id = $1 AND pg.status = 'active'
      ORDER BY pg.created_at DESC`,
      [employeeId]
    );

    const groups: { group_name: string; group_id: number; tasks: ProjectTask[] }[] = [];
    for (const group of groupsResult.rows) {
      const tasksResult = await pool.query(
        `SELECT * FROM project_tasks
        WHERE group_id = $1 AND assigned_to = $2 AND status != 'completed'
        ORDER BY due_date ASC NULLS LAST`,
        [group.id, employeeId]
      );
      groups.push({
        group_name: group.name,
        group_id: group.id,
        tasks: tasksResult.rows,
      });
    }
    return groups;
  }
}

export default GroupModel;
