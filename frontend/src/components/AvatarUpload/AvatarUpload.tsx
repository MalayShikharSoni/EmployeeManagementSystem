import React, { useRef, useState } from 'react';
import styles from './AvatarUpload.module.css';
import { authAPI } from '../../services/api';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  name: string;
  size?: number;
  onUploadSuccess?: (newUrl: string) => void;
  readOnly?: boolean;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ 
  currentAvatarUrl, 
  name, 
  size = 100, 
  onUploadSuccess,
  readOnly = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleClick = () => {
    if (!readOnly && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Maximum size is 5MB.');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await authAPI.uploadAvatar(formData);
      if (response.data.success && onUploadSuccess) {
        onUploadSuccess(response.data.data.avatar_url);
      }
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      alert('Failed to upload avatar. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getInitials = (name: string) => {
    return name ? name.substring(0, 2).toUpperCase() : '??';
  };

  return (
    <div 
      className={styles.avatarContainer} 
      style={{ width: size, height: size, cursor: readOnly ? 'default' : 'pointer' }}
      onClick={handleClick}
    >
      {currentAvatarUrl ? (
        <img src={currentAvatarUrl} alt={`${name}'s avatar`} className={styles.avatarImage} />
      ) : (
        <div className={styles.avatarFallback} style={{ fontSize: size * 0.4 }}>
          {getInitials(name)}
        </div>
      )}
      
      {!readOnly && !isUploading && (
        <div className={styles.overlay}>
          Change
        </div>
      )}
      
      {isUploading && (
        <div className={styles.loading}>
          ...
        </div>
      )}

      {!readOnly && (
        <input 
          type="file" 
          ref={fileInputRef} 
          className={styles.fileInput} 
          accept="image/jpeg, image/png, image/webp"
          onChange={handleFileChange}
        />
      )}
    </div>
  );
};

export default AvatarUpload;
