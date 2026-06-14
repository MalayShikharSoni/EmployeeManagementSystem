// src/services/socketService.ts
import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Notification from '../models/notificationModel';
import { 
  ServerToClientEvents, 
  ClientToServerEvents, 
  InterServerEvents, 
  SocketData,
  ClientTask,
  ClientInvitation
} from '../types/socketTypes';

class SocketService {
  private static instance: SocketService;
  private io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> | null = null;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public initialize(httpServer: HttpServer): void {
    this.io = new Server(httpServer, {
      cors: {
        origin: [
          'http://localhost:3000',
          'http://localhost:3001',
          'http://localhost:5173',
          'http://localhost:5174',
          'https://workwave-six.vercel.app'
        ],
        credentials: true,
        methods: ['GET', 'POST', 'OPTIONS']
      }
    });

    // Authentication middleware
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number; role: string };
        socket.data.userId = decoded.id;
        socket.data.role = decoded.role;
        next();
      } catch (err) {
        next(new Error('Authentication error: Invalid token'));
      }
    });

    this.io.on('connection', (socket) => {
      const userId = socket.data.userId;
      const role = socket.data.role;

      console.log(`Socket connected: User ${userId} (${role})`);

      // Automatically join personal room
      socket.join(`user:${userId}`);

      // If admin, join admin room
      if (role === 'admin') {
        socket.join(`admin:${userId}`);
      }

      socket.on('disconnect', () => {
        console.log(`Socket disconnected: User ${userId}`);
      });
    });
  }

  public getIO(): Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> {
    if (!this.io) {
      throw new Error('Socket.io not initialized. Call initialize(httpServer) first.');
    }
    return this.io;
  }

  // --- Central notification helper: persist + emit ---

  public async createAndEmitNotification(
    userId: number,
    type: string,
    title: string,
    message: string,
    entityId?: string,
    entityType?: string
  ): Promise<void> {
    try {
      const notification = await Notification.create(userId, type, title, message, entityId, entityType);
      this.getIO().to(`user:${userId}`).emit('notification:new', notification);
    } catch (error) {
      console.error('Failed to create/emit notification:', error);
    }
  }

  // --- Helper methods for emitting events ---

  public emitTaskAssigned(employeeId: number, task: ClientTask): void {
    this.getIO().to(`user:${employeeId}`).emit('task:assigned', task);
    // Persist notification
    this.createAndEmitNotification(
      employeeId,
      'task_assigned',
      'New Task Assigned',
      `You have been assigned a new task: "${task.title}"`,
      String(task.id),
      'task'
    );
  }

  public emitTaskStatusChanged(adminId: number, employeeId: number, taskId: number, status: string): void {
    // Notify both the admin and the assigned employee
    this.getIO().to(`user:${adminId}`).emit('task:statusChanged', { taskId, status });
    this.getIO().to(`user:${employeeId}`).emit('task:statusChanged', { taskId, status });

    // Persist notification for admin
    const statusLabel = status === 'completed' ? 'completed' : status === 'failed' ? 'rejected' : 'accepted';
    this.createAndEmitNotification(
      adminId,
      status === 'completed' ? 'task_completed' : status === 'failed' ? 'task_failed' : 'task_assigned',
      'Task Status Updated',
      `A task has been ${statusLabel} (ID: ${taskId})`,
      String(taskId),
      'task'
    );
  }

  public emitInvitationReceived(employeeId: number, invitation: ClientInvitation): void {
    this.getIO().to(`user:${employeeId}`).emit('invitation:received', invitation);
    // Persist notification
    this.createAndEmitNotification(
      employeeId,
      'invitation_received',
      'Team Invitation',
      'You have received a new team invitation',
      String(invitation.id),
      'invitation'
    );
  }

  public emitInvitationResponded(adminId: number, invitationId: number, status: string): void {
    this.getIO().to(`user:${adminId}`).emit('invitation:responded', { invitationId, status });
    // Persist notification
    this.createAndEmitNotification(
      adminId,
      'invitation_accepted',
      'Invitation Response',
      `An invitation has been ${status}`,
      String(invitationId),
      'invitation'
    );
  }
}

export default SocketService.getInstance();
