'use client';

import { useForm, useWatch } from 'react-hook-form';
import { useState, useRef } from 'react';
import { createStore } from '../../../actions/store';
import { createClient } from '@/app/lib/supabase/browser-client';

import PhotoUpload from '@/app/(main)/components/PhotoUpload';
import Image from 'next/image';
import defaultStorePhoto from '@/public/default-store-photo.png';

type FormValues = {
  storeName: string;
  storeStreetAddress: string;
};

export default function AddStoreForm() {
  const [isSaving, setIsSaving] = useState(false);

  // previewUrl represents the locally selected file for the UI
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // Track if the user has explicitly clicked "Remove" but hasn't saved yet
  const [isPendingDelete, setIsPendingDelete] = useState(false);

  const supabase = createClient();
  const photoUploadRef = useRef<{ resetFile: () => void }>(null);

  // Determine image to show the user
  const displayImage = isPendingDelete
    ? defaultStorePhoto.src
    : previewUrl || defaultStorePhoto.src;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      storeName: '',
      storeStreetAddress: '',
    },
  });

  const storeName = useWatch({
    control,
    name: 'storeName',
  });
  const storeStreetAddress = useWatch({
    control,
    name: 'storeStreetAddress',
  });

  const bothFilled =
    storeName.trim().length > 0 && storeStreetAddress.trim().length > 0;
  const eitherFilled =
    storeName.trim().length > 0 || storeStreetAddress.trim().length > 0;

  const hasDirtyTextOrImage = isDirty || !!selectedFile || isPendingDelete;

  const handleFileSelect = (file: File) => {
    const maxSize = 200 * 1024; // 200 KB in bytes
    if (file.size > maxSize) {
      alert('File is too large. Please select an image under 200 KB.');
      return;
    }
    // Create a temporary local blob URL for immediate UI feedback
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    setSelectedFile(file);
    setIsPendingDelete(false);
  };

  const handleRemovePhoto = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setIsPendingDelete(true);
    photoUploadRef.current?.resetFile();
  };

  const onCancel = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSelectedFile(null);
    setIsPendingDelete(false);
    photoUploadRef.current?.resetFile();
    reset();
  };

  const onSubmit = async (data: FormValues) => {
    await createStore({
      name: data.storeName,
      street_address: data.storeStreetAddress,
    });
    reset({ storeName: '', storeStreetAddress: '' });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div>
          <Image
            src={displayImage}
            alt="Profile photo"
            width={64}
            height={64}
            style={{ objectFit: 'cover' }}
            unoptimized
          />

          {/* Only show Remove if there is currently a photo and we aren't already deleting it */}
          {!isPendingDelete && displayImage !== defaultStorePhoto.src && (
            <button type="button" onClick={handleRemovePhoto}>
              Remove
            </button>
          )}

          <br />
          <PhotoUpload ref={photoUploadRef} onFileSelect={handleFileSelect} />
        </div>

        <label>Store name</label>
        <input {...register('storeName')} />
      </div>

      <div>
        <label>Store street address</label>
        <input {...register('storeStreetAddress')} />
      </div>

      {bothFilled && <button type="submit">Save</button>}

      {eitherFilled && (
        <button
          type="button"
          onClick={() => reset({ storeName: '', storeStreetAddress: '' })}
        >
          Cancel
        </button>
      )}
    </form>
  );
}
