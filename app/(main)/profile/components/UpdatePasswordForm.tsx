'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { createClient } from '@/app/lib/supabase/browser-client';

type FormValues = {
  newPassword: string;
  newPasswordConfirmation: string;
};

export default function UpdatePasswordForm() {
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      newPassword: '',
      newPasswordConfirmation: '',
    },
  });

  const supabase = createClient();

  const newPassword = useWatch({
    control,
    name: 'newPassword',
  });

  const newPasswordConfirmation = useWatch({
    control,
    name: 'newPasswordConfirmation',
  });

  const passwordsMatch =
    newPassword.length > 0 &&
    newPasswordConfirmation.length > 0 &&
    newPassword === newPasswordConfirmation;

  const onSubmit = async (formData: FormValues) => {
    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword,
      });

      if (error) {
        console.error('Password update error:', error);
        setErrorMessage(error.message ?? 'Failed to update password.');
        return;
      }

      setSuccessMessage('Password updated.');
      reset();
    } catch (error) {
      console.error('Password update error:', error);
      setErrorMessage('Failed to update password. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>New password</label>
      <input
        type="password"
        {...register('newPassword', {
          minLength: 8,
          pattern:
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        })}
      />
      {errors.newPassword && (
        <p role="alert">
          Password must be at least 8 characters and include an uppercase
          letter, a lowercase letter, a number, and a symbol.
        </p>
      )}
      <br />
      <label>Confirm new password</label>
      <input type="password" {...register('newPasswordConfirmation')} />

      {newPasswordConfirmation.length > 0 && !passwordsMatch && (
        <p role="alert">Passwords do not match.</p>
      )}
      <br />
      {(newPassword.length > 0 || newPasswordConfirmation.length > 0) && (
        <button
          type="button"
          onClick={() =>
            reset({
              newPassword: '',
              newPasswordConfirmation: '',
            })
          }
          disabled={isSaving}
        >
          Cancel
        </button>
      )}
      {errorMessage && <p role="alert">{errorMessage}</p>}
      {successMessage && <p role="status">{successMessage}</p>}
      {passwordsMatch && (
        <button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      )}
    </form>
  );
}
