'use client';

import type { User, UserUpdate } from '@/app/types/user';
import { useForm } from 'react-hook-form';
import { updateUser } from '@/app/actions/user';
import { useState, useRef } from 'react';
import { createClient } from '@/app/lib/supabase/browser-client';
import PhotoUpload from '@/app/(main)/components/PhotoUpload';
import styles from '@/app/(main)/components/ProfilePage.module.css';

type ProfileFormValues = {
  email: string;
  firstName: string;
  lastName: string;
};

export default function ProfileForm({ user }: { user: User }) {
  const [isSaving, setIsSaving] = useState(false);
  // photoUrl represents what is currently in the DB
  const [photoUrl, setPhotoUrl] = useState<string | null>(
    user.profile_photo_url,
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
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
    },
  });

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
    setPhotoUrl(user.profile_photo_url);
    photoUploadRef.current?.resetFile();
    reset();
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    try {
      let finalPhotoUrl = photoUrl;
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        // Handle deletion if flagged
        if (isPendingDelete) {
          await supabase.storage
            .from('profile_photos')
            .remove([`${authUser.id}/profile.jpg`]);
          finalPhotoUrl = null;
        }

        // Handle upload if a new file is selected
        if (selectedFile) {
          const { error: uploadError } = await supabase.storage
            .from('profile_photos')
            .upload(`${authUser.id}/profile.jpg`, selectedFile, {
              upsert: true,
            });

          if (uploadError) {
            console.error('Upload error:', uploadError.message);
          } else {
            const { data: publicData } = supabase.storage
              .from('profile_photos')
              .getPublicUrl(`${authUser.id}/profile.jpg`);

            finalPhotoUrl = `${publicData.publicUrl}?t=${Date.now()}`;
          }
        }
      }

      // Create a partial update object
      const changes: UserUpdate = {};
      if (data.firstName !== user.first_name)
        changes.first_name = data.firstName;
      if (data.lastName !== user.last_name) changes.last_name = data.lastName;
      if (data.email !== user.email) changes.email = data.email;
      if (selectedFile || isPendingDelete) {
        changes.profile_photo_url = finalPhotoUrl;
      }

      const result = await updateUser(user.user_id, changes);

      if (result.success) {
        setPhotoUrl(finalPhotoUrl);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        setSelectedFile(null);
        setIsPendingDelete(false);
        photoUploadRef.current?.resetFile();
        reset({
          firstName: data.firstName,
          lastName: data.lastName,
          email: user.email,
        });
        if (data.email !== user.email) {
          alert('Please check your new email address to verify the change.');
        }
      } else {
        console.error('Error updating profile:', result.error);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Determine image to show the user
  const hasDirtyTextOrImage = isDirty || !!selectedFile || isPendingDelete;

  return (
    <div className={styles.card}>
      <div className={styles.cardBody}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2 className={styles.userInfoText}>User Information</h2>
          <PhotoUpload
            variant="circle"
            ref={photoUploadRef}
            id="photo-upload-input"
            initialPhotoUrl={photoUrl}
            previewUrl={previewUrl}
            isPendingDelete={isPendingDelete}
            onFileSelect={handleFileSelect}
            onRemove={handleRemovePhoto}
          />
          <div className={styles.fieldGroup}>
            <div className="two-col-row">
              <div>
                <label className="field-label">First name</label>
                <input
                  className="form-control"
                  {...register('firstName', { required: true })}
                />
                {errors.firstName?.type === 'required' && (
                  <p role="alert">First name is required.</p>
                )}
              </div>

              <div>
                <label className="field-label">Last name</label>
                <input
                  className="form-control"
                  {...register('lastName', { required: true })}
                />
                {errors.lastName?.type === 'required' && (
                  <p role="alert">Last name is required.</p>
                )}
              </div>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className="field-label">Email</label>
            <input
              className="form-control"
              {...register('email', { required: true })}
            />
            {errors.email?.type === 'required' && (
              <p role="alert">Email is required.</p>
            )}
          </div>

          {hasDirtyTextOrImage && (
            <div className="btn-row">
              <button
                className="btn-cancel"
                type="button"
                onClick={onCancel}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button className="btn-save" type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
