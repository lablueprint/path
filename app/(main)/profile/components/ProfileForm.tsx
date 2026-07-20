'use client';

import type { User, UserUpdate } from '@/app/types/user';
import { useForm, Controller } from 'react-hook-form';
import { PatternFormat } from 'react-number-format';
import { updateUser } from '@/app/actions/user';
import { useState, useRef, forwardRef } from 'react';
import { createClient } from '@/app/lib/supabase/browser-client';
import PhotoUpload from '@/app/(main)/components/PhotoUpload';
import styles from '@/app/(main)/profile/components/ProfileForm.module.css';
import Image from 'next/image';
import defaultProfilePhoto from '@/public/image-placeholder.svg';
import { Button, Form } from 'react-bootstrap';
import type { FormControlProps } from 'react-bootstrap';

type ProfileFormValues = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
};

const BootstrapInput = forwardRef<HTMLInputElement, FormControlProps>(
  (props, ref) => <Form.Control {...props} ref={ref} />,
);

BootstrapInput.displayName = 'BootstrapInput';

export default function ProfileForm({ user }: { user: User }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
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
    control,
    watch,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phone: user.phone,
    },
  });

  const watchedValues = watch();

  const handleFileSelect = (file: File) => {
    setErrorMessage('');
    setSuccessMessage('');
    const maxSize = 200 * 1024;
    if (file.size > maxSize) {
      setErrorMessage(
        'File is too large. Please select an image under 200 KB.',
      );
      return;
    }
    setPreviewUrl(URL.createObjectURL(file));
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
    setIsEditing(false);
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

      const changes: UserUpdate = {};
      if (data.firstName !== user.first_name)
        changes.first_name = data.firstName;
      if (data.lastName !== user.last_name) changes.last_name = data.lastName;
      if (data.email !== user.email) changes.email = data.email;
      if (selectedFile || isPendingDelete)
        changes.profile_photo_url = finalPhotoUrl;
      if (data.phone !== user.phone) changes.phone = data.phone;

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
          phone: data.phone,
        });
        setIsEditing(false);
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

  return (
    <div className={`form-card ${styles.card}`}>
      <div className={styles.cardBody}>
        <form onSubmit={handleSubmit(onSubmit)} className="form-body">
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
                className="object-fit-cover"
              />
            </div>
          )}
          <div className="two-col-row">
            <div>
              {isEditing ? (
                <>
                  <label className="form-label form-label field-label">
                    First Name
                  </label>
                  <Form.Control
                    className="form-control"
                    {...register('firstName', {
                      required: 'First name is required.',
                    })}
                    isInvalid={!!errors.firstName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.firstName?.message}
                  </Form.Control.Feedback>
                </>
              ) : (
                <>
                  <p className={styles.textLabel}>First Name</p>
                  <p>{watchedValues.firstName}</p>
                </>
              )}
            </div>

            <div>
              {isEditing ? (
                <>
                  <label className="form-label field-label">Last Name</label>
                  <Form.Control
                    className="form-control"
                    {...register('lastName', {
                      required: 'Last name is required.',
                    })}
                    isInvalid={!!errors.lastName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.lastName?.message}
                  </Form.Control.Feedback>
                </>
              ) : (
                <>
                  <p className={styles.textLabel}>Last Name</p>
                  <p>{watchedValues.lastName}</p>
                </>
              )}
            </div>
          </div>

          <div className="two-col-row">
            <div>
              {isEditing ? (
                <>
                  <label className="form-label field-label">Email</label>
                  <Form.Control
                    className="form-control"
                    {...register('email', {
                      required: 'Email is required.',
                    })}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email?.message}
                  </Form.Control.Feedback>
                </>
              ) : (
                <>
                  <p className={styles.textLabel}>Email</p>
                  <p>{watchedValues.email}</p>
                </>
              )}
            </div>

            <div>
              {isEditing ? (
                <>
                  <label className="form-label field-label">Phone Number</label>
                  <Controller
                    name="phone"
                    control={control}
                    rules={{
                      validate: (value) => {
                        const digits = value?.replace(/\D/g, '');

                        return (
                          digits.length === 10 ||
                          'Phone number must be 10 digits.'
                        );
                      },
                    }}
                    render={({ field }) => (
                      <PatternFormat
                        {...field}
                        format="(###) ###-####"
                        mask="_"
                        allowEmptyFormatting
                        onValueChange={(values) => {
                          field.onChange(values.value);
                        }}
                        customInput={BootstrapInput}
                        isInvalid={!!errors.phone}
                      />
                    )}
                  />
                  {errors.phone && (
                    <Form.Control.Feedback type="invalid">
                      {errors.phone.message}
                    </Form.Control.Feedback>
                  )}
                </>
              ) : (
                <>
                  <p className={styles.textLabel}>Phone Number</p>
                  <p>{watchedValues.phone}</p>
                </>
              )}
            </div>
          </div>

          {errorMessage && <p role="alert">{errorMessage}</p>}
          {successMessage && <p role="status">{successMessage}</p>}

          {isEditing && (
            <div className="btn-row">
              <Button className="btn-submit" type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
              <Button
                className="btn-cancel"
                type="button"
                onClick={onCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          )}

          {!isEditing && (
            <div className="btn-row">
              <Button
                type="button"
                className="btn-submit"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
