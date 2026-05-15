'use client';

import { useForm, useWatch } from 'react-hook-form';
import { useState, useRef } from 'react';
import { createStore, updateStore } from '@/app/actions/store';
import { createClient } from '@/app/lib/supabase/browser-client';
import PhotoUpload from '@/app/(main)/components/PhotoUpload';
import Image from 'next/image';
import defaultStorePhoto from '@/public/image-placeholder.svg';

type FormValues = {
  storeName: string;
  storeStreetAddress: string;
};

export default function AddStoreForm() {
  const [isSaving, setIsSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const supabase = createClient();
  const photoUploadRef = useRef<{ resetFile: () => void }>(null);

  const { register, handleSubmit, control, reset } = useForm<FormValues>({
    defaultValues: {
      storeName: '',
      storeStreetAddress: '',
    },
  });

  const storeName = useWatch({ control, name: 'storeName' });
  const storeStreetAddress = useWatch({ control, name: 'storeStreetAddress' });

  const bothFilled =
    storeName.trim().length > 0 && storeStreetAddress.trim().length > 0;
  const eitherFilled =
    storeName.trim().length > 0 || storeStreetAddress.trim().length > 0;

  const handleFileSelect = (file: File) => {
    const maxSize = 200 * 1024;
    if (file.size > maxSize) {
      alert('File is too large. Please select an image under 200 KB.');
      return;
    }
    setPreviewUrl(URL.createObjectURL(file));
    setSelectedFile(file);
  };

  const handleRemovePhoto = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    photoUploadRef.current?.resetFile();
  };

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    try {
      const store = await createStore({
        name: data.storeName,
        street_address: data.storeStreetAddress,
      });

      if (!store.success || !store.data) return;

      const store_id = store.data.store_id;
      let finalPhotoUrl = defaultStorePhoto.src;

      if (selectedFile) {
        const { error: uploadError } = await supabase.storage
          .from('store_photos')
          .upload(`${store_id}/store.jpg`, selectedFile, { upsert: true });

        if (uploadError) {
          console.error('Upload error:', uploadError.message);
        } else {
          const { data: publicData } = supabase.storage
            .from('store_photos')
            .getPublicUrl(`${store_id}/store.jpg`);

          finalPhotoUrl = `${publicData.publicUrl}?t=${Date.now()}`;
          await updateStore(store_id, { photo_url: finalPhotoUrl });
        }
      }

      reset({ storeName: '', storeStreetAddress: '' });
      setSelectedFile(null);
      setPreviewUrl(null);
      photoUploadRef.current?.resetFile();
    } catch (error) {
      console.error('Error saving store profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const displayImage = previewUrl || defaultStorePhoto.src;

  return (
    <div className="form-card">
      <div className="card-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <Image
              src={displayImage}
              alt="Store photo"
              width={64}
              height={64}
              className="photo"
              unoptimized
            />
            {displayImage !== defaultStorePhoto.src && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="btn-cancel"
              >
                Remove
              </button>
            )}
            <PhotoUpload ref={photoUploadRef} onFileSelect={handleFileSelect} />
          </div>

          <div className="mb-3">
            <label className="form-label field-label">Store name</label>
            <input {...register('storeName')} className="form-control" />
          </div>

          <div className="mb-3">
            <label className="form-label field-label">
              Store street address
            </label>
            <input
              {...register('storeStreetAddress')}
              className="form-control"
            />
          </div>

          <div className="button-spacing">
            {bothFilled && (
              <button type="submit" disabled={isSaving} className="btn-submit">
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            )}
            {eitherFilled && (
              <button
                type="button"
                className="btn-cancel"
                disabled={isSaving}
                onClick={() => {
                  reset({ storeName: '', storeStreetAddress: '' });
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  photoUploadRef.current?.resetFile();
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
