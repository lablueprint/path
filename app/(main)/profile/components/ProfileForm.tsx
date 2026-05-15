'use client';

import type { User, UserUpdate } from '@/app/types/user';
import { useForm } from 'react-hook-form';
import { updateUser } from '@/app/actions/user';
import { useState, useRef } from 'react';
import { createClient } from '@/app/lib/supabase/browser-client';
import PhotoUpload from '@/app/(main)/components/PhotoUpload';
import styles from '@/app/(main)/components/ProfilePage.module.css';
import Image from 'next/image';
import defaultProfilePhoto from '@/public/default-profile-picture.png';

type ProfileFormValues = {
  email: string;
  firstName: string;
  lastName: string;
};

export default function ProfileForm({ user }: { user: User }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(
    user.profile_photo_url,
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPendingDelete, setIsPendingDelete] = useState(false);

  const supabase = createClient();
  const photoUploadRef = useRef<{ resetFile: () => void }>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
    },
  });

  const watchedValues = watch();

  const handleFileSelect = (file: File) => {
    const maxSize = 200 * 1024;
    if (file.size > maxSize) {
      alert('File is too large. Please select an image under 200 KB.');
      return;
    }
    setPreviewUrl(URL.createObjectURL(file));
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
    setIsEditing(false);
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    try {
      let finalPhotoUrl = photoUrl;
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        if (isPendingDelete) {
          await supabase.storage
            .from('profile_photos')
            .remove([`${authUser.id}/profile.jpg`]);
          finalPhotoUrl = null;
        }

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

      const changes: UserUpdate = {};
      if (data.firstName !== user.first_name)
        changes.first_name = data.firstName;
      if (data.lastName !== user.last_name) changes.last_name = data.lastName;
      if (data.email !== user.email) changes.email = data.email;
      if (selectedFile || isPendingDelete)
        changes.profile_photo_url = finalPhotoUrl;

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
        setIsEditing(false);
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

  return (
    <div className={styles.card}>
      <div className={styles.cardBody}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2 className={isEditing ? styles.userInfoTextEdit : styles.userInfoText}>
            User Information
          </h2>

          {isEditing ? (
              <div className={styles.avatarCircleEdit}>
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
              </div>
          ) : (
              <div className={styles.avatarCircle}>
                <Image
                  src={photoUrl || defaultProfilePhoto.src}
                  alt="Profile photo"
                  width={96}
                  height={96}
                  unoptimized
                />
              </div>
          )}

          <div className={styles.fieldGroup}>
            <div className="two-col-row">
              <div>
                <label className={styles.profileLabel}>First name</label>
                {isEditing ? (
                  <>
                    <input
                      className="form-control"
                      {...register('firstName', { required: true })}
                    />
                    {errors.firstName?.type === 'required' && (
                      <p role="alert">First name is required.</p>
                    )}
                  </>
                ) : (
                  <p className="form-control-plaintext">
                    {watchedValues.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className={styles.profileLabel}>Last name</label>
                {isEditing ? (
                  <>
                    <input
                      className="form-control"
                      {...register('lastName', { required: true })}
                    />
                    {errors.lastName?.type === 'required' && (
                      <p role="alert">Last name is required.</p>
                    )}
                  </>
                ) : (
                  <p className="form-control-plaintext">
                    {watchedValues.lastName}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.profileLabel}>Email</label>
            {isEditing ? (
              <>
                <input
                  className="form-control"
                  {...register('email', { required: true })}
                />
                {errors.email?.type === 'required' && (
                  <p role="alert">Email is required.</p>
                )}
              </>
            ) : (
              <p className="form-control-plaintext">{watchedValues.email}</p>
            )}
          </div>

          {isEditing && (
            <div className="btn-row">
              <button
                className="btn-cancel"
                type="button"
                onClick={onCancel}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button className="btn-submit" type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {!isEditing && (
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
