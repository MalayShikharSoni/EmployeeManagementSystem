// src/controllers/taskController.ts
import { Request, Response } from 'express';
import Task from '../models/taskModel';
import pool from '../config/database';

class TaskController {
  // Create a new task (Admin only)
  static async createTask(req: Request, res: Response): Promise<void> {
    try {
      const { title, description, category, dueDate, priority, assignedTo } = req.body;
      const createdBy = req.user.id;

      // Validate required fields
      if (!title || !assignedTo) {
        res.status(400).json({
          success: false,
          error: 'Title and assignedTo are required'
        });
        return;
      }

      // Validate that the employee is on this admin's team
      const teamCheck = await pool.query(
        `SELECT id FROM team_invitations 
         WHERE admin_id = $1 AND employee_id = $2 AND status = 'accepted'`,
        [createdBy, assignedTo]
      );

      if (teamCheck.rows.length === 0) {
        res.status(403).json({
          success: false,
          error: 'You can only assign tasks to employees on your team'
        });
        return;
      }

      // Create task
      const task = await Task.create({
        title,
        description,
        category,
        dueDate,
        priority: priority || 'medium',
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
  static async getMyTasks(req: Request, res: Response): Promise<void> {
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
  static async getAllTasks(_req: Request, res: Response): Promise<void> {
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
  static async getTasksByEmployee(req: Request, res: Response): Promise<void> {
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
  static async acceptTask(req: Request, res: Response): Promise<void> {
    try {
      const taskId = req.params.taskId as string;
      const userId = req.user.id;

      const task = await Task.getById(taskId);

      if (!task) {
        res.status(404).json({
          success: false,
          error: 'Task not found'
        });
        return;
      }

      if (task.assigned_to !== userId) {
        res.status(403).json({
          success: false,
          error: 'You can only accept tasks assigned to you'
        });
        return;
      }

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
  static async completeTask(req: Request, res: Response): Promise<void> {
    try {
      const taskId = req.params.taskId as string;
      const userId = req.user.id;

      const task = await Task.getById(taskId);

      if (!task) {
        res.status(404).json({
          success: false,
          error: 'Task not found'
        });
        return;
      }

      if (task.assigned_to !== userId) {
        res.status(403).json({
          success: false,
          error: 'You can only complete tasks assigned to you'
        });
        return;
      }

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
  static async failTask(req: Request, res: Response): Promise<void> {
    try {
      const taskId = req.params.taskId as string;
      const userId = req.user.id;

      const task = await Task.getById(taskId);

      if (!task) {
        res.status(404).json({
          success: false,
          error: 'Task not found'
        });
        return;
      }

      if (task.assigned_to !== userId) {
        res.status(403).json({
          success: false,
          error: 'You can only reject tasks assigned to you'
        });
        return;
      }

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
  static async getMyTaskCounts(req: Request, res: Response): Promise<void> {
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
  static async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const taskId = req.params.taskId as string;

      const deletedTask = await Task.delete(taskId);

      if (!deletedTask) {
        res.status(404).json({
          success: false,
          error: 'Task not found'
        });
        return;
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

export default TaskController;
