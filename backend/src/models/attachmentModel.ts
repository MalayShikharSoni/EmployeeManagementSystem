// src/models/attachmentModel.ts
import pool from '../config/database';

export interface AttachmentRow {
  id: number;
  task_id: number;
  uploaded_by: number;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: number;
  created_at: Date;
}

class Attachment {
  static async create(
    taskId: number,
    uploadedBy: number,
    fileUrl: string,
    fileName: string,
    fileType: string,
    fileSize: number
  ): Promise<AttachmentRow> {
    const query = `
      INSERT INTO task_attachments (task_id, uploaded_by, file_url, file_name, file_type, file_size)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [taskId, uploadedBy, fileUrl, fileName, fileType, fileSize];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getByTaskId(taskId: number | string): Promise<AttachmentRow[]> {
    const query = `
      SELECT * FROM task_attachments
      WHERE task_id = $1
      ORDER BY created_at ASC
    `;
    const result = await pool.query(query, [taskId]);
    return result.rows;
  }

  static async getById(attachmentId: number | string): Promise<AttachmentRow | undefined> {
    const query = 'SELECT * FROM task_attachments WHERE id = $1';
    const result = await pool.query(query, [attachmentId]);
    return result.rows[0];
  }

  static async delete(attachmentId: number | string): Promise<AttachmentRow | undefined> {
    const query = 'DELETE FROM task_attachments WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [attachmentId]);
    return result.rows[0];
  }

  static async countByTaskId(taskId: number | string): Promise<number> {
    const query = 'SELECT COUNT(*)::int as count FROM task_attachments WHERE task_id = $1';
    const result = await pool.query(query, [taskId]);
    return result.rows[0].count;
  }
}

export default Attachment;
