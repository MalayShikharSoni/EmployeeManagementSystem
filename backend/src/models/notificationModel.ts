// src/models/notificationModel.ts
import pool from '../config/database';

export interface NotificationRow {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  entity_id: string | null;
  entity_type: string | null;
  is_read: boolean;
  created_at: string;
}

class Notification {
  static async create(
    userId: number,
    type: string,
    title: string,
    message: string,
    entityId?: string,
    entityType?: string
  ): Promise<NotificationRow> {
    const result = await pool.query(
      `INSERT INTO notifications (user_id, type, title, message, entity_id, entity_type)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userId, type, title, message, entityId || null, entityType || null]
    );
    return result.rows[0];
  }

  static async getByUserId(userId: number, limit = 20, offset = 0): Promise<NotificationRow[]> {
    const result = await pool.query(
      `SELECT * FROM notifications 
       WHERE user_id = $1 
       ORDER BY is_read ASC, created_at DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows;
  }

  static async getUnreadCount(userId: number): Promise<number> {
    const result = await pool.query(
      `SELECT COUNT(*)::int AS count FROM notifications 
       WHERE user_id = $1 AND is_read = false`,
      [userId]
    );
    return result.rows[0].count;
  }

  static async markAsRead(notificationId: number, userId: number): Promise<NotificationRow | null> {
    const result = await pool.query(
      `UPDATE notifications SET is_read = true 
       WHERE id = $1 AND user_id = $2 RETURNING *`,
      [notificationId, userId]
    );
    return result.rows[0] || null;
  }

  static async markAllAsRead(userId: number): Promise<number> {
    const result = await pool.query(
      `UPDATE notifications SET is_read = true 
       WHERE user_id = $1 AND is_read = false`,
      [userId]
    );
    return result.rowCount || 0;
  }
}

export default Notification;
