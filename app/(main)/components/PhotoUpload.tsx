'use client';

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';
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
    const [isCompressing, setIsCompressing] = useState(false);

    useImperativeHandle(ref, () => ({
      resetFile: () => {
        if (inputRef.current) inputRef.current.value = '';
      },
    }));

    // Handle compression
    const processAndCompressFile = async (file: File) => {
      if (!file.type.startsWith('image/')) return;

      const MAX_KB = 200;
      const TARGET_MB = 0.18;

      // If the file is already under 200 KB, skip compression
      if (file.size / 1024 < 200) {
        onFileSelect?.(file);
        return;
      }

      try {
        setIsCompressing(true);

        let currentDimensions = 1024;

        // Force lossy compression for unpredictable PNGs/transparent images
        const targetFileType =
          file.type === 'image/png' ? 'image/jpeg' : file.type;

        const baseOptions = {
          maxSizeMB: TARGET_MB,
          maxWidthOrHeight: currentDimensions,
          useWebWorker: true,
          fileType: targetFileType,
          maxIteration: 20, // Increase binary search resolution
        };

        let compressedBlob = await imageCompression(file, baseOptions);

        // If still > 200 KB, progressively scale down dimensions
        while (compressedBlob.size / 1024 > MAX_KB && currentDimensions > 200) {
          currentDimensions = Math.floor(currentDimensions * 0.8); // Reduce dimensions by 20%

          compressedBlob = await imageCompression(compressedBlob, {
            ...baseOptions,
            maxWidthOrHeight: currentDimensions,
            initialQuality: 0.6,
          });
        }

        // Preserve original extension/name, updating MIME type if converted from PNG to JPEG
        const newFileName =
          file.type === 'image/png'
            ? file.name.replace(/\.png$/i, '.jpg')
            : file.name;

        const compressedFile = new File([compressedBlob], newFileName, {
          type: targetFileType,
          lastModified: Date.now(),
        });

        onFileSelect?.(compressedFile);
      } catch (error) {
        console.error(
          'Image compression failed, using original file instead:',
          error,
        );
        onFileSelect?.(file); // Fallback to original file if compression errors out
      } finally {
        setIsCompressing(false);
      }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processAndCompressFile(file);
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
      if (file) processAndCompressFile(file);
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
              alt="Photo"
              width={variant === 'circle' ? 200 : 256}
              height={variant === 'circle' ? 200 : 256}
              className="object-fit-cover"
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
                {isCompressing ? (
                  <>Compressing image...</>
                ) : (
                  <>
                    Drag and drop file here or <u>browse</u>
                  </>
                )}
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
          disabled={isCompressing}
        />
      </div>
    );
  },
);

PhotoUpload.displayName = 'PhotoUpload';
export default PhotoUpload;
