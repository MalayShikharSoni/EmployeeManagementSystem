import { Router } from 'express';
import GroupController from '../controllers/groupController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Group CRUD
router.post('/', GroupController.createGroup);
router.get('/', GroupController.getGroups);

// Employee group tasks (must be before /:groupId to avoid route conflict)
router.get('/my-tasks', GroupController.getMyGroupTasks);

// Group detail & sub-resources
router.get('/:groupId', GroupController.getGroupDetail);
router.post('/:groupId/tasks', GroupController.createGroupTask);
router.get('/:groupId/tasks', GroupController.getGroupTasks);
router.get('/:groupId/progress', GroupController.getGroupProgress);
router.put('/:groupId/github', GroupController.updateGithubUrl);
router.get('/:groupId/github-stats', GroupController.getGithubStats);
router.put('/:groupId/tasks/:taskId/status', GroupController.updateTaskStatus);

export default router;
