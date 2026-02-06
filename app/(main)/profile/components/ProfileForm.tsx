'use client';

import type { User } from '@/app/types/user';
import { useForm } from 'react-hook-form';
import { updateUser } from '@/app/actions/user';

export default function ProfileForm({ user }: { user: User }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
    },
  });

  const onSubmit = async (data: {
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    await updateUser(user.user_id, {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      profile_photo_url: user.profile_photo_url,
    });

    reset({
      firstName: data.firstName,
      lastName: data.lastName,
      email: user.email,
    });
  };
  const onCancel = () => {
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* First name */}
      <label>First name</label>
      <input {...register('firstName', { required: true })} />
      {errors.firstName?.type === 'required' && (
        <p role="alert">First name is required.</p>
      )}
      <br />
      {/* Last name */}
      <label>Last name</label>
      <input {...register('lastName', { required: true })} />
      {errors.lastName?.type === 'required' && (
        <p role="alert">Last name is required.</p>
      )}
      <br />
      {/* Email */}
      <label>Email</label>
      <input {...register('email', { required: true })} />
      {errors.email?.type === 'required' && (
        <p role="alert">Email is required.</p>
      )}
      <br />
      {isDirty && (
        <>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit">Save</button>
        </>
      )}
    </form>
  );
}
