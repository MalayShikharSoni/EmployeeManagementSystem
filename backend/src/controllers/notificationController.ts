// src/controllers/notificationController.ts
import { Request, Response } from 'express';
import Notification from '../models/notificationModel';

class NotificationController {
  static async getNotifications(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const notifications = await Notification.getByUserId(userId, limit, offset);

      res.json({
        success: true,
        data: notifications
      });
    } catch (error) {
      console.error('Get notifications error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch notifications'
      });
    }
  }

  static async getUnreadCount(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      const count = await Notification.getUnreadCount(userId);

      res.json({
        success: true,
        data: { count }
      });
    } catch (error) {
      console.error('Get unread count error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch unread count'
      });
    }
  }

  static async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      const notificationId = parseInt(req.params.id as string, 10);

      const notification = await Notification.markAsRead(notificationId, userId);

      if (!notification) {
        res.status(404).json({
          success: false,
          error: 'Notification not found'
        });
        return;
      }

      res.json({
        success: true,
        data: notification
      });
    } catch (error) {
      console.error('Mark as read error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to mark notification as read'
      });
    }
  }

  static async markAllAsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      const count = await Notification.markAllAsRead(userId);

      res.json({
        success: true,
        data: { markedCount: count }
      });
    } catch (error) {
      console.error('Mark all as read error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to mark all notifications as read'
      });
    }
  }
}

export default NotificationController;
