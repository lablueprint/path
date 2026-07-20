'use client';

import { useForm } from 'react-hook-form';
import type { Store, StoreUpdate } from '@/app/types/store';
import { updateStore } from '@/app/actions/store';
import { useRef, useState } from 'react';
import { createClient } from '@/app/lib/supabase/browser-client';
import PhotoUpload from '@/app/(main)/components/PhotoUpload';
import { Form, Button } from 'react-bootstrap';

type FormValues = {
  name: string;
  street_address: string;
};

export default function EditStoreForm({ store }: { store: Store }) {
  const [isSaving, setIsSaving] = useState(false);

  // photoUrl represents what is currently in the DB
  const [photoUrl, setPhotoUrl] = useState<string | null>(
    store?.photo_url ?? null,
  );

  // previewUrl represents the locally selected file for the UI
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // Track if the user has explicitly clicked "Remove" but hasn't saved yet
  const [isPendingDelete, setIsPendingDelete] = useState(false);

  const supabase = createClient();
  const photoUploadRef = useRef<{ resetFile: () => void }>(null);

  const {
    register,
    handleSubmit,
    formState: { isDirty, errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      name: store.name,
      street_address: store.street_address,
    },
  });

  const handleFileSelect = (file: File) => {
    const maxSize = 200 * 1024; // 200 KB in bytes
    if (file.size > maxSize) {
      alert('File is too large. Please select an image under 200 KB.');
      return;
    }
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
    setPhotoUrl(store?.photo_url ?? null);
    photoUploadRef.current?.resetFile();
    reset();
  };

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    try {
      let finalPhotoUrl = photoUrl;

      // Handle deletion if flagged
      if (isPendingDelete) {
        await supabase.storage
          .from('store_photos')
          .remove([`${store.store_id}/store.jpg`]);
        finalPhotoUrl = null;
      }

      // Handle upload if a new file is selected
      if (selectedFile) {
        const { error: uploadError } = await supabase.storage
          .from('store_photos')
          .upload(`${store.store_id}/store.jpg`, selectedFile, {
            upsert: true,
          });

        if (uploadError) {
          console.error('Upload error:', uploadError.message);
        } else {
          const { data: publicData } = supabase.storage
            .from('store_photos')
            .getPublicUrl(`${store.store_id}/store.jpg`);

          finalPhotoUrl = `${publicData.publicUrl}?t=${Date.now()}`;
        }
      }

      const changes: StoreUpdate = {};
      if (data.name !== store.name) changes.name = data.name;
      if (data.street_address !== store.street_address)
        changes.street_address = data.street_address;
      if (selectedFile || isPendingDelete) changes.photo_url = finalPhotoUrl;

      const result = await updateStore(store.store_id, changes);

      if (result.success) {
        setPhotoUrl(finalPhotoUrl);
        setSelectedFile(null);
        setIsPendingDelete(false);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        photoUploadRef.current?.resetFile();
        reset({ name: data.name, street_address: data.street_address });
      } else {
        console.error('Error updating store:', result.error);
      }
    } catch (error) {
      console.error('Error saving store:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const hasDirtyTextOrImage = isDirty || !!selectedFile || isPendingDelete;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-card">
      <div className="card-body">
        <div className="two-col-layout">
          <div className="photo-col">
            <PhotoUpload
              ref={photoUploadRef}
              onFileSelect={handleFileSelect}
              previewUrl={previewUrl}
              initialPhotoUrl={photoUrl}
              isPendingDelete={isPendingDelete}
              onRemove={handleRemovePhoto}
            />
          </div>

          <div className="fields-col">
            <div>
              <label className="form-label field-label">Store Name</label>
              <Form.Control
                {...register('name', {
                  required: 'Store name is required.',
                })}
                className="form-control"
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name?.message}
              </Form.Control.Feedback>
            </div>

            <div>
              <label className="form-label field-label">
                Store Street Address
              </label>
              <Form.Control
                {...register('street_address', {
                  required: 'Store street address is required.',
                })}
                className="form-control"
                isInvalid={!!errors.street_address}
              />
              <Form.Control.Feedback type="invalid">
                {errors.street_address?.message}
              </Form.Control.Feedback>
            </div>

            {hasDirtyTextOrImage && (
              <div className="btn-row">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="btn-submit"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>

                <Button
                  type="button"
                  className="btn-cancel"
                  onClick={onCancel}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
