'use client';

import { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import React from 'react';

type FileUploaderProps = {
    onFileSelect: (file: File) => void;
    inputRef: React.RefObject<HTMLInputElement | null>;
};

const FileUploader = ({ onFileSelect, inputRef }: FileUploaderProps) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onFileSelect(file);
        }
    };

    return (
        <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
        />
    );
};

type PhotoUploadProps = {
    onFileSelect?: (file: File) => void;
};

const PhotoUpload = forwardRef<{ resetFile: () => void }, PhotoUploadProps>(
    ({ onFileSelect }, ref) => {
        const [selectedFile, setSelectedFile] = useState<File | null>(null);
        const inputRef = useRef<HTMLInputElement>(null);

        useImperativeHandle(ref, () => ({
            resetFile: () => {
                setSelectedFile(null);
                if (inputRef.current) {
                    inputRef.current.value = '';
                }
            },
        }));

        const handleFileUpload = (file: File) => {
            setSelectedFile(file);
            onFileSelect?.(file);
        };

        return (
            <div>
                <FileUploader onFileSelect={handleFileUpload} inputRef={inputRef} />
                {selectedFile ? (
                    <div>Selected: {selectedFile.name}</div>
                ) : (
                    <div>No file selected</div>
                )}
            </div>
        );
    }
);

PhotoUpload.displayName = 'PhotoUpload';

export default PhotoUpload;