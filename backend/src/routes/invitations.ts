// src/routes/invitations.ts
import { Router } from 'express';
import InvitationController from '../controllers/invitationController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Admin routes
router.post('/send', requireRole('admin'), InvitationController.sendInvitation);
router.get('/team', requireRole('admin'), InvitationController.getTeamMembers);
router.get('/available-employees', requireRole('admin'), InvitationController.getAvailableEmployees);
router.get('/pending', requireRole('admin'), InvitationController.getPendingInvitations);

// Employee routes
router.get('/my-invitations', InvitationController.getMyInvitations);
router.put('/respond/:id', InvitationController.respondToInvitation);

export default router;
