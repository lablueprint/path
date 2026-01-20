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
      first_name: user.first_name,
      last_name: user.last_name,
    },
  });

  const onSubmit = (data: { first_name: string; last_name: string }) => {
    updateUser(user.user_id, {
      first_name: data.first_name,
      last_name: data.last_name,
      email: user.email,
      profile_photo_url: user.profile_photo_url,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* First name */}
      <label>First name</label>
      <input {...register('first_name', { required: true })} />
      {errors.first_name?.type === 'required' && (
        <p role="alert">First name is required.</p>
      )}
      <br />
      {/* Last name */}
      <label>Last name</label>
      <input {...register('last_name', { required: true })} />
      {errors.last_name?.type === 'required' && (
        <p role="alert">Last name is required.</p>
      )}
      <br />
      {/* Save button */}
      <button type="submit">Save</button>
    </form>
  );
}
