import { Router } from 'express';
import EmployeeController from '../controllers/employeeController';
import { authenticate } from '../middleware/auth';

const router = Router();

// GET /api/employees/:employeeId/stats
router.get('/:employeeId/stats', authenticate, EmployeeController.getEmployeeStats);

export default router;
