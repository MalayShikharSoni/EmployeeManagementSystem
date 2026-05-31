import React, { useState, useEffect } from 'react';
import { taskAPI } from '../../services/api';
import type { TaskAttachment } from '../../types';
import styles from './TaskAttachments.module.css';

interface TaskAttachmentsProps {
  taskId: number;
}

const getFileIcon = (fileType: string): string => {
  if (fileType.startsWith('image/')) return 'IMG';
  if (fileType === 'application/pdf') return 'PDF';
  if (fileType.includes('wordprocessingml')) return 'DOC';
  if (fileType.includes('spreadsheetml')) return 'XLS';
  return 'FILE';
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const AttachmentBadge: React.FC<{ count: number }> = ({ count }) => {
  if (count === 0) return null;
  return (
    <span className={styles.attachmentBadge}>
      {count}
    </span>
  );
};

const TaskAttachments: React.FC<TaskAttachmentsProps> = ({ taskId }) => {
  const [attachments, setAttachments] = useState<TaskAttachment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAttachments = async () => {
      try {
        const response = await taskAPI.getAttachments(taskId);
        setAttachments(response.data.data);
      } catch (error) {
        console.error('Failed to fetch attachments:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAttachments();
  }, [taskId]);

  if (isLoading) return <div className={styles.loadingText}>Loading files...</div>;
  if (attachments.length === 0) return null;

  return (
    <div className={styles.attachmentsWrap}>
      <div className={styles.attachmentsList}>
        {attachments.map((att) => (
          <a
            key={att.id}
            href={att.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.attachmentItem}
          >
            <span className={styles.fileIcon}>{getFileIcon(att.file_type)}</span>
            <span className={styles.fileName}>{att.file_name}</span>
            <span className={styles.fileSize}>{formatFileSize(att.file_size)}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default TaskAttachments;
