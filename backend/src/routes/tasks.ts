// src/routes/tasks.ts
import { Router } from 'express';
import TaskController from '../controllers/taskController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Employee routes - get own tasks
router.get('/my-tasks', TaskController.getMyTasks);
router.get('/my-task-counts', TaskController.getMyTaskCounts);

// Employee routes - task actions
router.put('/:taskId/accept', TaskController.acceptTask);
router.put('/:taskId/complete', TaskController.completeTask);
router.put('/:taskId/fail', TaskController.failTask);

// Admin routes - manage all tasks
router.post('/', requireRole('admin'), TaskController.createTask);
router.get('/all', requireRole('admin'), TaskController.getAllTasks);
router.get('/by-employee', requireRole('admin'), TaskController.getTasksByEmployee);
router.delete('/:taskId', requireRole('admin'), TaskController.deleteTask);

export default router;
