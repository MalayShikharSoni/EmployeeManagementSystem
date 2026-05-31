// src/models/taskModel.ts
import pool from '../config/database';

interface CreateTaskParams {
  title: string;
  description?: string;
  category?: string;
  dueDate?: string;
  priority?: string;
  createdBy: number;
  assignedTo: number;
}

interface TaskRow {
  id: number;
  title: string;
  description: string;
  category: string;
  due_date: string;
  priority: string;
  is_overdue: boolean;
  status: 'new' | 'active' | 'completed' | 'failed';
  created_by: number;
  assigned_to: number;
  created_at: Date;
  updated_at: Date;
  creator_name?: string;
  assignee_name?: string;
  assignee_email?: string;
  attachment_count?: number;
}

interface TaskCounts {
  active: number;
  new_task: number;
  completed: number;
  failed: number;
}

interface GroupedEmployeeTasks {
  user_id: number;
  first_name: string;
  email: string;
  tasks: TaskRow[];
  active_count: number;
  new_task_count: number;
  completed_count: number;
  failed_count: number;
}

interface TaskWithFlags extends TaskRow {
  active: boolean;
  newTask: boolean;
  new_task: boolean;
  completed: boolean;
  failed: boolean;
}

class Task {
  // Create a new task
  static async create({ title, description, category, dueDate, priority = 'medium', createdBy, assignedTo }: CreateTaskParams): Promise<TaskRow> {
    const query = `
      INSERT INTO tasks (title, description, category, due_date, priority, created_by, assigned_to, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'new')
      RETURNING *
    `;

    const values = [title, description, category, dueDate, priority, createdBy, assignedTo];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Get all tasks for a user
  static async getByUserId(userId: number): Promise<TaskRow[]> {
    const query = `
      SELECT 
        t.*,
        creator.first_name as creator_name,
        assignee.first_name as assignee_name,
        (SELECT COUNT(*)::int FROM task_attachments ta WHERE ta.task_id = t.id) as attachment_count
      FROM tasks t
      LEFT JOIN users creator ON t.created_by = creator.id
      LEFT JOIN users assignee ON t.assigned_to = assignee.id
      WHERE t.assigned_to = $1
      ORDER BY t.created_at DESC
    `;

    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  // Get all tasks (admin view)
  static async getAll(): Promise<TaskRow[]> {
    const query = `
      SELECT 
        t.*,
        creator.first_name as creator_name,
        assignee.first_name as assignee_name,
        assignee.email as assignee_email,
        (SELECT COUNT(*)::int FROM task_attachments ta WHERE ta.task_id = t.id) as attachment_count
      FROM tasks t
      LEFT JOIN users creator ON t.created_by = creator.id
      LEFT JOIN users assignee ON t.assigned_to = assignee.id
      ORDER BY t.created_at DESC
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  // Get task by ID
  static async getById(taskId: number | string): Promise<TaskRow | undefined> {
    const query = 'SELECT * FROM tasks WHERE id = $1';
    const result = await pool.query(query, [taskId]);
    return result.rows[0];
  }

  // Update task status
  static async updateStatus(taskId: number | string, status: string): Promise<TaskRow> {
    const query = `
      UPDATE tasks
      SET 
        status = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;

    const values = [status, taskId];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Get user's task counts
  static async getTaskCounts(userId: number): Promise<TaskCounts> {
    const query = `
      SELECT 
        COUNT(*) FILTER (WHERE status = 'active') as active,
        COUNT(*) FILTER (WHERE status = 'new') as new_task,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) FILTER (WHERE status = 'failed') as failed
      FROM tasks
      WHERE assigned_to = $1
    `;

    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  // Delete task
  static async delete(taskId: number | string): Promise<TaskRow | undefined> {
    const query = 'DELETE FROM tasks WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [taskId]);
    return result.rows[0];
  }

  // Get tasks grouped by employee (for admin dashboard — scoped to admin's team)
  static async getGroupedByEmployee(adminId: number): Promise<GroupedEmployeeTasks[]> {
    const query = `
      SELECT 
        u.id as user_id,
        u.first_name,
        u.email,
        COALESCE(
          json_agg(
            json_build_object(
              'id', t.id,
              'title', t.title,
              'description', t.description,
              'category', t.category,
              'due_date', t.due_date,
              'priority', t.priority,
              'is_overdue', t.is_overdue,
              'status', t.status,
              'created_at', t.created_at,
              'attachment_count', (SELECT COUNT(*)::int FROM task_attachments ta WHERE ta.task_id = t.id)
            ) ORDER BY t.created_at DESC
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) as tasks,
        COUNT(*) FILTER (WHERE t.status = 'active') as active_count,
        COUNT(*) FILTER (WHERE t.status = 'new') as new_task_count,
        COUNT(*) FILTER (WHERE t.status = 'completed') as completed_count,
        COUNT(*) FILTER (WHERE t.status = 'failed') as failed_count
      FROM users u
      INNER JOIN team_invitations ti ON u.id = ti.employee_id
      LEFT JOIN tasks t ON u.id = t.assigned_to
      WHERE u.role = 'employee' AND ti.admin_id = $1 AND ti.status = 'accepted'
      GROUP BY u.id, u.first_name, u.email
      ORDER BY u.first_name
    `;

    const result = await pool.query(query, [adminId]);
    return result.rows;
  }

  // Helper method to convert status string to boolean flags (for frontend compatibility)
  static convertStatusToFlags(task: TaskRow): TaskWithFlags {
    return {
      ...task,
      active: task.status === 'active',
      newTask: task.status === 'new',
      new_task: task.status === 'new', // both naming conventions
      completed: task.status === 'completed',
      failed: task.status === 'failed'
    };
  }

  // Get tasks with boolean flags for frontend
  static async getByUserIdWithFlags(userId: number): Promise<TaskWithFlags[]> {
    const tasks = await this.getByUserId(userId);
    return tasks.map(task => this.convertStatusToFlags(task));
  }
}

export default Task;
export type { CreateTaskParams, TaskRow, TaskCounts, GroupedEmployeeTasks, TaskWithFlags };
