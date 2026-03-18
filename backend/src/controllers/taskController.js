const Task = require('../models/taskModel');
const pool = require('../config/database');

class TaskController {
  // Create a new task (Admin only)
  static async createTask(req, res) {
    try {
      const { title, description, category, dueDate, assignedTo } = req.body;
      const createdBy = req.user.id;

      // Validate required fields
      if (!title || !assignedTo) {
        return res.status(400).json({
          success: false,
          error: 'Title and assignedTo are required'
        });
      }

      // Validate that the employee is on this admin's team
      const teamCheck = await pool.query(
        `SELECT id FROM team_invitations 
         WHERE admin_id = $1 AND employee_id = $2 AND status = 'accepted'`,
        [createdBy, assignedTo]
      );

      if (teamCheck.rows.length === 0) {
        return res.status(403).json({
          success: false,
          error: 'You can only assign tasks to employees on your team'
        });
      }

      // Create task
      const task = await Task.create({
        title,
        description,
        category,
        dueDate,
        createdBy,
        assignedTo
      });

      res.status(201).json({
        success: true,
        data: task
      });
    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create task'
      });
    }
  }

  // Get all tasks for current user
  static async getMyTasks(req, res) {
    try {
      const userId = req.user.id;
      const tasks = await Task.getByUserId(userId);

      res.json({
        success: true,
        data: tasks
      });
    } catch (error) {
      console.error('Get tasks error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch tasks'
      });
    }
  }

  // Get all tasks (Admin only)
  static async getAllTasks(req, res) {
    try {
      const tasks = await Task.getAll();

      res.json({
        success: true,
        data: tasks
      });
    } catch (error) {
      console.error('Get all tasks error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch tasks'
      });
    }
  }

  // Get tasks grouped by employee (Admin only)
  static async getTasksByEmployee(req, res) {
    try {
      const adminId = req.user.id;
      const groupedTasks = await Task.getGroupedByEmployee(adminId);

      res.json({
        success: true,
        data: groupedTasks
      });
    } catch (error) {
      console.error('Get grouped tasks error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch grouped tasks'
      });
    }
  }

  // Accept task (Employee only)
  static async acceptTask(req, res) {
    try {
      const { taskId } = req.params;
      const userId = req.user.id;

      // Get task to verify ownership
      const task = await Task.getById(taskId);

      if (!task) {
        return res.status(404).json({
          success: false,
          error: 'Task not found'
        });
      }

      if (task.assigned_to !== userId) {
        return res.status(403).json({
          success: false,
          error: 'You can only accept tasks assigned to you'
        });
      }

      // Update status to active
      const updatedTask = await Task.updateStatus(taskId, 'active');

      res.json({
        success: true,
        data: updatedTask
      });
    } catch (error) {
      console.error('Accept task error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to accept task'
      });
    }
  }

  // Complete task (Employee only)
  static async completeTask(req, res) {
    try {
      const { taskId } = req.params;
      const userId = req.user.id;

      // Get task to verify ownership
      const task = await Task.getById(taskId);

      if (!task) {
        return res.status(404).json({
          success: false,
          error: 'Task not found'
        });
      }

      if (task.assigned_to !== userId) {
        return res.status(403).json({
          success: false,
          error: 'You can only complete tasks assigned to you'
        });
      }

      // Update status to completed
      const updatedTask = await Task.updateStatus(taskId, 'completed');

      res.json({
        success: true,
        data: updatedTask
      });
    } catch (error) {
      console.error('Complete task error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to complete task'
      });
    }
  }

  // Fail/Reject task (Employee only)
  static async failTask(req, res) {
    try {
      const { taskId } = req.params;
      const userId = req.user.id;

      // Get task to verify ownership
      const task = await Task.getById(taskId);

      if (!task) {
        return res.status(404).json({
          success: false,
          error: 'Task not found'
        });
      }

      if (task.assigned_to !== userId) {
        return res.status(403).json({
          success: false,
          error: 'You can only reject tasks assigned to you'
        });
      }

      // Update status to failed
      const updatedTask = await Task.updateStatus(taskId, 'failed');

      res.json({
        success: true,
        data: updatedTask
      });
    } catch (error) {
      console.error('Fail task error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to reject task'
      });
    }
  }

  // Get task counts for current user
  static async getMyTaskCounts(req, res) {
    try {
      const userId = req.user.id;
      const counts = await Task.getTaskCounts(userId);

      res.json({
        success: true,
        data: counts
      });
    } catch (error) {
      console.error('Get task counts error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch task counts'
      });
    }
  }

  // Delete task (Admin only)
  static async deleteTask(req, res) {
    try {
      const { taskId } = req.params;

      const deletedTask = await Task.delete(taskId);

      if (!deletedTask) {
        return res.status(404).json({
          success: false,
          error: 'Task not found'
        });
      }

      res.json({
        success: true,
        message: 'Task deleted successfully',
        data: deletedTask
      });
    } catch (error) {
      console.error('Delete task error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete task'
      });
    }
  }
}

module.exports = TaskController;