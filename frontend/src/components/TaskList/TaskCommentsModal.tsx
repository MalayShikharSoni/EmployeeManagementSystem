import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { commentAPI } from '../../services/api';
import type { TaskComment } from '../../types';
import { useSocket } from '../../context/SocketProvider';
import { useAuth } from '../../context/AuthProvider';
import AvatarUpload from '../AvatarUpload/AvatarUpload';
import styles from './TaskCommentsModal.module.css';

interface TaskCommentsModalProps {
  taskId: number;
  isOpen: boolean;
  onClose: () => void;
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  
  // If today, just show time
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // Otherwise show date and time
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + 
         date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const TaskCommentsModal: React.FC<TaskCommentsModalProps> = ({ taskId, isOpen, onClose }) => {
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const { userData } = useAuth();
  const { socket } = useSocket();
  
  const listRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      fetchComments();
    } else {
      document.body.style.overflow = '';
      setNewComment('');
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, taskId]);

  // Scroll to bottom when comments change
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [comments, isOpen]);

  // Socket listener for new comments
  useEffect(() => {
    if (!socket || !isOpen) return;

    const handleNewComment = (comment: TaskComment) => {
      // Only add if it belongs to this task
      if (comment.task_id === taskId) {
        setComments(prev => {
          // Prevent duplicates
          if (prev.some(c => c.id === comment.id)) return prev;
          return [...prev, comment];
        });
      }
    };

    socket.on('comment:new', handleNewComment);
    return () => {
      socket.off('comment:new', handleNewComment);
    };
  }, [socket, isOpen, taskId]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const res = await commentAPI.getComments(taskId);
      setComments(res.data.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newComment.trim() || isSending) return;

    try {
      setIsSending(true);
      const res = await commentAPI.createComment(taskId, newComment);
      // Wait for socket to receive it, or append optimistically? 
      // Socket will broadcast it back to us, but we can also just append it.
      // We'll let the socket handle it to ensure we don't duplicate if socket is fast.
      // Wait, since we are the sender, let's just append it locally immediately.
      setComments(prev => {
        if (prev.some(c => c.id === res.data.data.id)) return prev;
        return [...prev, res.data.data];
      });
      setNewComment('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = '50px';
      }
    } catch (error) {
      console.error('Failed to send comment:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      await commentAPI.deleteComment(taskId, commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
    // Auto-resize
    e.target.style.height = '50px';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={`${styles.backdrop} ${isOpen ? styles.backdropOpen : ''}`} onClick={onClose}>
      <div 
        className={`${styles.modal} ${isOpen ? styles.modalOpen : ''}`} 
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>Task Comments</h2>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>

        <div className={styles.commentsList} ref={listRef}>
          {isLoading ? (
            <div className={styles.emptyState}>Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className={styles.emptyState}>No comments yet. Start the conversation!</div>
          ) : (
            comments.map(comment => {
              const isOwn = comment.author_id === userData?.data?.id;
              return (
                <div key={comment.id} className={`${styles.commentWrapper} ${isOwn ? styles.commentOwn : styles.commentOther}`}>
                  <div className={styles.avatarWrap}>
                    <AvatarUpload 
                      currentAvatarUrl={comment.author_avatar} 
                      name={comment.author_name || 'User'} 
                      size={36} 
                      readOnly 
                    />
                  </div>
                  <div className={styles.commentContent}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span className={styles.authorName}>{isOwn ? 'You' : comment.author_name}</span>
                      <span className={styles.timestamp}>{formatTime(comment.created_at)}</span>
                      {isOwn && (
                        <button className={styles.deleteBtn} onClick={() => handleDelete(comment.id)}>
                          Delete
                        </button>
                      )}
                    </div>
                    <div className={styles.bubble}>
                      {comment.content.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className={styles.inputArea}>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            placeholder="Type a comment... (Enter to send, Shift+Enter for new line)"
            value={newComment}
            onChange={handleTextareaInput}
            onKeyDown={handleKeyDown}
            disabled={isSending}
          />
          <button 
            className={styles.sendBtn} 
            onClick={handleSend} 
            disabled={!newComment.trim() || isSending}
            title="Send"
          >
            <svg viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TaskCommentsModal;
