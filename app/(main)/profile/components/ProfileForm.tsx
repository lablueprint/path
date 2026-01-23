'use client';

import type { User } from '@/app/types/user';
import { useForm } from 'react-hook-form';
import { updateUser } from '@/app/actions/user';

export default function ProfileForm({ user }: { user: User }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: user.first_name,
      lastName: user.last_name,
    },
  });

  const onSubmit = (data: { firstName: string; lastName: string }) => {
    updateUser(user.user_id, {
      first_name: data.firstName,
      last_name: data.lastName,
      email: user.email,
      profile_photo_url: user.profile_photo_url,
    });
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
      {/* Save button */}
      <button type="submit">Save</button>
    </form>
  );
}
