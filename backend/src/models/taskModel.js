const pool = require('../config/database');

class Task {
  // Create a new task
  static async create({ title, description, category, dueDate, createdBy, assignedTo }) {
    const query = `
      INSERT INTO tasks (title, description, category, due_date, created_by, assigned_to, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'new')
      RETURNING *
    `;
    
    const values = [title, description, category, dueDate, createdBy, assignedTo];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Get all tasks for a user
  static async getByUserId(userId) {
    const query = `
      SELECT 
        t.*,
        creator.first_name as creator_name,
        assignee.first_name as assignee_name
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
  static async getAll() {
    const query = `
      SELECT 
        t.*,
        creator.first_name as creator_name,
        assignee.first_name as assignee_name,
        assignee.email as assignee_email
      FROM tasks t
      LEFT JOIN users creator ON t.created_by = creator.id
      LEFT JOIN users assignee ON t.assigned_to = assignee.id
      ORDER BY t.created_at DESC
    `;
    
    const result = await pool.query(query);
    return result.rows;
  }

  // Get task by ID
  static async getById(taskId) {
    const query = 'SELECT * FROM tasks WHERE id = $1';
    const result = await pool.query(query, [taskId]);
    return result.rows[0];
  }

  // Update task status
  static async updateStatus(taskId, status) {
    // status can be: 'new', 'active', 'completed', 'failed'
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
  static async getTaskCounts(userId) {
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
  static async delete(taskId) {
    const query = 'DELETE FROM tasks WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [taskId]);
    return result.rows[0];
  }

  // Get tasks grouped by employee (for admin dashboard)
  static async getGroupedByEmployee() {
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
              'status', t.status,
              'created_at', t.created_at
            ) ORDER BY t.created_at DESC
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) as tasks,
        COUNT(*) FILTER (WHERE t.status = 'active') as active_count,
        COUNT(*) FILTER (WHERE t.status = 'new') as new_task_count,
        COUNT(*) FILTER (WHERE t.status = 'completed') as completed_count,
        COUNT(*) FILTER (WHERE t.status = 'failed') as failed_count
      FROM users u
      LEFT JOIN tasks t ON u.id = t.assigned_to
      WHERE u.role = 'employee'
      GROUP BY u.id, u.first_name, u.email
      ORDER BY u.first_name
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  // Helper method to convert status string to boolean flags (for frontend compatibility)
  static convertStatusToFlags(task) {
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
  static async getByUserIdWithFlags(userId) {
    const tasks = await this.getByUserId(userId);
    return tasks.map(task => this.convertStatusToFlags(task));
  }
}

module.exports = Task;