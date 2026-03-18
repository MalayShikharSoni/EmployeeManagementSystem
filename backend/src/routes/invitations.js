const express = require('express');
const InvitationController = require('../controllers/invitationController');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

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

module.exports = router;
