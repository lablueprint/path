'use client';

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import Image from 'next/image';
import defaultProfilePhoto from '@/public/image-placeholder.svg';
import uploadPhotoIcon from '@/public/image-upload.svg';
import styles from '@/app/(main)/components/PhotoUpload.module.css';

type PhotoUploadProps = {
  variant?: 'circle' | 'rectangle';
  initialPhotoUrl?: string | null;
  onFileSelect?: (file: File) => void;
  onRemove?: () => void;
  previewUrl?: string | null;
  isPendingDelete?: boolean;
  id?: string;
};

const PhotoUpload = forwardRef<{ resetFile: () => void }, PhotoUploadProps>(
  (
    {
      variant = 'rectangle',
      initialPhotoUrl,
      onFileSelect,
      onRemove,
      previewUrl,
      isPendingDelete,
      id = 'photo-upload-input',
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    useImperativeHandle(ref, () => ({
      resetFile: () => {
        if (inputRef.current) inputRef.current.value = '';
      },
    }));

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFileSelect?.(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file?.type.startsWith('image/')) onFileSelect?.(file);
    };

    const displayImage = isPendingDelete
      ? defaultProfilePhoto.src
      : previewUrl || initialPhotoUrl || defaultProfilePhoto.src;

    const hasPhoto = displayImage !== defaultProfilePhoto.src;

    return (
      <div className={styles.wrapper}>
        <label
          htmlFor={id}
          className={[
            styles.container,
            styles[variant],
            isDragging ? styles.dragging : '',
            hasPhoto ? styles.hasPhoto : '',
          ].join(' ')}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {hasPhoto ? (
            <Image
              src={displayImage}
              alt="Profile photo"
              width={200}
              height={200}
              style={{ objectFit: 'cover' }}
              unoptimized
            />
          ) : (
            <div className={styles.placeholder}>
              <Image
                src={uploadPhotoIcon.src}
                alt="Upload photo"
                width={32}
                height={32}
                className={styles.placeholderImage}
                unoptimized
              />
              <span className={styles.photoPlaceholderText}>
                Drag and drop file here or <u>browse</u>
              </span>
            </div>
          )}
        </label>

        {!isPendingDelete && hasPhoto && (
          <button
            type="button"
            onClick={onRemove}
            className={[
              styles.removeButton,
              variant === 'circle' ? styles.removeButtonCircle : '',
            ].join(' ')}
          >
            —
          </button>
        )}

        <input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
    );
  },
);

PhotoUpload.displayName = 'PhotoUpload';
export default PhotoUpload;
