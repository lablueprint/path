'use client';

import type { User } from '@/app/types/user';
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
  const [isUploading, setIsUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string>(
    user.profile_photo_url || defaultProfilePhoto.src,
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
  };

  const handleSavePhoto = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase.storage
        .from('profile_photos')
        .upload(`${user.id}/profile.jpg`, selectedFile, { upsert: true });

      if (error) {
        console.error('Upload error:', error.message);
      } else {
        const { data } = supabase.storage
          .from('profile_photos')
          .getPublicUrl(`${user.id}/profile.jpg`);

        const freshUrl = `${data.publicUrl}?t=${Date.now()}`;

        await updateUser(user.id, {
          profile_photo_url: freshUrl,
        });

        setPhotoUrl(freshUrl);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        setSelectedFile(null);
      }
    }
    setIsUploading(false);
  };

  const handleCancelPhoto = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSelectedFile(null);
    photoUploadRef.current?.resetFile();
  };

  const handleRemovePhoto = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase.storage
        .from('profile_photos')
        .remove([`${user.id}/profile.jpg`]);

      if (error) {
        console.error('Remove error:', error.message);
        return;
      }

      await updateUser(user.id, { profile_photo_url: '' });
    }

    setPhotoUrl(defaultProfilePhoto.src);
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  const onSubmit = async (data: ProfileFormValues) => {
    await updateUser(user.user_id, {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      profile_photo_url: photoUrl,
    });
    reset(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        {/* Show preview if user picked a file; otherwise show the saved URL */}
        <Image
          src={previewUrl || photoUrl}
          alt="Profile photo"
          width={64}
          height={64}
          style={{ objectFit: 'cover' }}
          unoptimized
        />
        {previewUrl ? (
          <>
            <button
              type="button"
              onClick={handleSavePhoto}
              disabled={isUploading}
            >
              Save
            </button>
            <button type="button" onClick={handleCancelPhoto}>
              Cancel
            </button>
          </>
        ) : (
          photoUrl !== defaultProfilePhoto.src && (
            <>
              <button type="button" onClick={handleRemovePhoto}>
                Remove
              </button>
            </>
          )
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
      {isDirty && (
        <>
          <button type="submit">Save</button>
          <button type="button" onClick={() => reset()}>
            Cancel
          </button>
        </>
      )}
    </form>
  );
}
