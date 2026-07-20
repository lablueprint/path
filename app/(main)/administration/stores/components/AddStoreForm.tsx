'use client';

import { useForm } from 'react-hook-form';
import { useState, useRef } from 'react';
import { createStore, updateStore } from '@/app/actions/store';
import { createClient } from '@/app/lib/supabase/browser-client';
import PhotoUpload from '@/app/(main)/components/PhotoUpload';
import defaultStorePhoto from '@/public/image-placeholder.svg';
import { Form, Button } from 'react-bootstrap';

type FormValues = {
  storeName: string;
  storeStreetAddress: string;
};

export default function AddStoreForm() {
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const supabase = createClient();
  const photoUploadRef = useRef<{ resetFile: () => void }>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      storeName: '',
      storeStreetAddress: '',
    },
  });

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
    setErrorMessage('');
    setSuccessMessage('');
    setIsSaving(true);
    try {
      const store = await createStore({
        name: data.storeName,
        street_address: data.storeStreetAddress,
      });

      if (!store.success || !store.data) {
        setErrorMessage('Failed to add store: ' + store.error);
        return;
      }

      const store_id = store.data.store_id;
      let finalPhotoUrl = defaultStorePhoto.src;

      if (selectedFile) {
        const { error: uploadError } = await supabase.storage
          .from('store_photos')
          .upload(`${store_id}/store.jpg`, selectedFile, { upsert: true });

        if (uploadError) {
          setErrorMessage('Failed to upload photo: ' + uploadError.message);
          return;
        } else {
          const { data: publicData } = supabase.storage
            .from('store_photos')
            .getPublicUrl(`${store_id}/store.jpg`);

          finalPhotoUrl = `${publicData.publicUrl}?t=${Date.now()}`;
          const result = await updateStore(store_id, {
            photo_url: finalPhotoUrl,
          });
          if (!result.success) {
            setErrorMessage('Failed to add photo: ' + result.error);
            return;
          }
        }
      }

      reset({ storeName: '', storeStreetAddress: '' });
      setSelectedFile(null);
      setPreviewUrl(null);
      photoUploadRef.current?.resetFile();
      setSuccessMessage('Store added.');
    } catch (error) {
      setErrorMessage('Failed to add store: ' + error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="form-card">
      <div className="card-body">
        <form onSubmit={handleSubmit(onSubmit)} className="form-body">
          <div className="two-col-layout">
            <div className="photo-col">
              <PhotoUpload
                ref={photoUploadRef}
                onFileSelect={handleFileSelect}
                previewUrl={previewUrl}
                onRemove={handleRemovePhoto}
              />
            </div>

            <div className="fields-col">
              <div>
                <label className="form-label field-label">Store Name</label>
                <Form.Control
                  {...register('storeName', {
                    required: 'Store name is required.',
                  })}
                  className="form-control"
                  isInvalid={!!errors.storeName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.storeName?.message}
                </Form.Control.Feedback>
              </div>

              <div>
                <label className="form-label field-label">
                  Store Street Address
                </label>
                <Form.Control
                  {...register('storeStreetAddress', {
                    required: 'Store street address is required.',
                  })}
                  className="form-control"
                  isInvalid={!!errors.storeStreetAddress}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.storeStreetAddress?.message}
                </Form.Control.Feedback>
              </div>
              {errorMessage && <p role="alert">{errorMessage}</p>}
              {successMessage && <p role="status">{successMessage}</p>}
              <div>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="btn-submit"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
