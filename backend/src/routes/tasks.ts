// src/routes/tasks.ts
import { Router } from 'express';
import multer from 'multer';
import TaskController from '../controllers/taskController';
import { authenticate, requireRole } from '../middleware/auth';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB per file
});

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

// Attachment routes (must be before generic /:taskId routes)
router.get('/:taskId/attachments', TaskController.getAttachments);
router.post('/:taskId/attachments', requireRole('admin'), upload.array('files', 5), TaskController.uploadAttachments);
router.delete('/:taskId/attachments/:attachmentId', requireRole('admin'), TaskController.deleteAttachment);

// Admin routes - manage all tasks
router.post('/', requireRole('admin'), upload.array('files', 5), TaskController.createTask);
router.get('/all', requireRole('admin'), TaskController.getAllTasks);
router.get('/by-employee', requireRole('admin'), TaskController.getTasksByEmployee);
router.delete('/:taskId', requireRole('admin'), TaskController.deleteTask);

export default router;
