'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import React from 'react';

type FileUploaderProps = {
  onFileSelect: (file: File) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  id?: string;
};

const FileUploader = ({ onFileSelect, inputRef, id }: FileUploaderProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <input
      ref={inputRef}
      id={id}
      type="file"
      accept="image/*"
      onChange={handleFileChange}
    />
  );
};

type PhotoUploadProps = {
  onFileSelect?: (file: File) => void;
  id?: string;
};

const PhotoUpload = forwardRef<{ resetFile: () => void }, PhotoUploadProps>(
  ({ onFileSelect, id }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      resetFile: () => {
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      },
    }));

    const handleFileUpload = (file: File) => {
      onFileSelect?.(file);
    };

    return (
      <FileUploader
        onFileSelect={handleFileUpload}
        inputRef={inputRef}
        id={id}
      />
    );
  },
);

PhotoUpload.displayName = 'PhotoUpload';

export default PhotoUpload;
