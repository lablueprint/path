'use client';

import type { User, UserUpdate } from '@/app/types/user';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { updateUser } from '@/app/actions/user';
import { useState, useRef } from 'react';
import { createClient } from '@/app/lib/supabase/browser-client';
import PhotoUpload from '@/app/(main)/components/PhotoUpload';
import defaultProfilePhoto from '@/public/default-profile-picture.png';
import styles from '@/app/(main)/components/ProfilePage.module.css';
import uploadPhotoIcon from '@/public/image-upload.svg';

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

  // For drag and drop image file
  const [isDragging, setIsDragging] = useState(false);

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
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
  const displayImage = isPendingDelete
    ? defaultProfilePhoto.src
    : previewUrl || photoUrl || defaultProfilePhoto.src;

  const hasDirtyTextOrImage = isDirty || !!selectedFile || isPendingDelete;

  return (
    <div className="form-card profile-form-card">
      <div className="card-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>User Information</h2>
          {/* <div className={styles.photoSection}>
            <Image
              src={displayImage}
              alt="Profile photo"
              width={64}
              height={64}
              style={{ objectFit: 'cover' }}
              unoptimized
            />

            {!isPendingDelete && displayImage !== defaultProfilePhoto.src && (
              <button type="button" onClick={handleRemovePhoto}>
                Remove
              </button>
            )}

            <br />
            <PhotoUpload ref={photoUploadRef} onFileSelect={handleFileSelect} />
          </div> */}
          <div className={styles.photoSection}>
            {/* Clicking the circle triggers the hidden PhotoUpload input */}
            <label htmlFor="photo-upload-input" style={{ cursor: 'pointer' }}>
              <div
                className={`${styles.photoCircle} ${isDragging ? styles.photoCircleDragging : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {displayImage !== defaultProfilePhoto.src ? (
                  <Image
                    src={displayImage}
                    alt="Profile photo"
                    width={120}
                    height={120}
                    style={{ objectFit: 'cover' }}
                    unoptimized
                  />
                ) : (
                  <div className={styles.photoPlaceholder}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={uploadPhotoIcon.src}
                      alt="Upload photo"
                      style={{ width: 32, height: 32 }}
                    />
                    {/* <Image
                      src={uploadPhotoIcon}
                      alt="Upload photo"
                      width={10}
                      height={10}
                    /> */}
                    <span className={styles.photoPlaceholderText}>
                      Drag and drop file here or <u>Browse</u>
                    </span>
                  </div>
                )}
              </div>
            </label>

            {!isPendingDelete && displayImage !== defaultProfilePhoto.src && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                style={{ marginTop: 8 }}
              >
                Remove
              </button>
            )}

            {/* Hidden — triggered by clicking the circle label */}
            <PhotoUpload
              ref={photoUploadRef}
              onFileSelect={handleFileSelect}
              id="photo-upload-input"
            />
          </div>

          <div className="two-col-row">
            <div>
              <label className="field-label">First name</label>
              <input
                className={styles.input}
                {...register('firstName', { required: true })}
              />
              {errors.firstName?.type === 'required' && (
                <p role="alert">First name is required.</p>
              )}
            </div>

            <div>
              <label className="field-label">Last name</label>
              <input
                className={styles.input}
                {...register('lastName', { required: true })}
              />
              {errors.lastName?.type === 'required' && (
                <p role="alert">Last name is required.</p>
              )}
            </div>
          </div>

          <label className="field-label">Email</label>
          <input
            className={styles.input}
            {...register('email', { required: true })}
          />
          {errors.email?.type === 'required' && (
            <p role="alert">Email is required.</p>
          )}

          {hasDirtyTextOrImage && (
            <>
              <button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button type="button" onClick={onCancel} disabled={isSaving}>
                Cancel
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
