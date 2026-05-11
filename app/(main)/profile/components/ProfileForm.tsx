'use client';

import type { User, UserUpdate } from '@/app/types/user';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { updateUser } from '@/app/actions/user';
import { useState, useRef } from 'react';
import { createClient } from '@/app/lib/supabase/browser-client';
import PhotoUpload from '@/app/(main)/components/PhotoUpload';
import defaultProfilePhoto from '@/public/default-profile-picture.png';

type ProfileFormValues = {
  email: string;
  firstName: string;
  lastName: string;
};

export default function ProfileForm({ user }: { user: User }) {
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
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
    setErrorMessage('');
    setSuccessMessage('');
    const maxSize = 200 * 1024; // 200 KB in bytes
    if (file.size > maxSize) {
      setErrorMessage(
        'File is too large. Please select an image under 200 KB.',
      );
      return;
    }
    // Create a temporary local blob URL for immediate UI feedback
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    setSelectedFile(file);
    setIsPendingDelete(false);
  };

  const handleRemovePhoto = () => {
    setErrorMessage('');
    setSuccessMessage('');
    setPreviewUrl(null);
    setSelectedFile(null);
    setIsPendingDelete(true);
    photoUploadRef.current?.resetFile();
  };

  const onCancel = () => {
    setErrorMessage('');
    setSuccessMessage('');
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
    setErrorMessage('');
    setSuccessMessage('');
    try {
      let finalPhotoUrl = photoUrl;
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        // Handle deletion if flagged
        if (isPendingDelete) {
          const { error: deleteError } = await supabase.storage
            .from('profile_photos')
            .remove([`${authUser.id}/profile.jpg`]);
          if (deleteError) {
            setErrorMessage(
              deleteError.message ?? 'Failed to remove profile photo.',
            );
            return;
          }
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
            setErrorMessage(
              uploadError.message ?? 'Failed to upload profile photo.',
            );
            return;
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
        setSuccessMessage(
          data.email !== user.email
            ? 'Profile saved. Please check both your new and old email addresses to verify the change.'
            : 'Profile saved.',
        );
      } else {
        setErrorMessage(result.error ?? 'Failed to save profile.');
        return;
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrorMessage('Failed to save profile.');
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
    <form onSubmit={handleSubmit(onSubmit)}>
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
        {!isPendingDelete && displayImage !== defaultProfilePhoto.src && (
          <button type="button" onClick={handleRemovePhoto}>
            Remove
          </button>
        )}

        <br />
        <PhotoUpload ref={photoUploadRef} onFileSelect={handleFileSelect} />
      </div>

      <label>First name</label>
      <input {...register('firstName', { required: true })} />
      {errors.firstName?.type === 'required' && (
        <p role="alert">First name is required.</p>
      )}
      <br />
      <label>Last name</label>
      <input {...register('lastName', { required: true })} />
      {errors.lastName?.type === 'required' && (
        <p role="alert">Last name is required.</p>
      )}
      <br />
      <label>Email</label>
      <input {...register('email', { required: true })} />
      {errors.email?.type === 'required' && (
        <p role="alert">Email is required.</p>
      )}
      <br />

      {errorMessage && <p role="alert">{errorMessage}</p>}
      {successMessage && <p role="status">{successMessage}</p>}

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
  );
}
