'use client';

import { useForm, useWatch } from 'react-hook-form';
import { createClient } from '@/app/lib/supabase/browser-client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type ResetPasswordFormValues = {
  password: string;
  passwordConfirmation: string;
};

export default function ResetPasswordPage() {
  const supabase = createClient();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    defaultValues: { password: '', passwordConfirmation: '' },
    mode: 'onChange',
  });

  const passwordValue = useWatch({
    control,
    name: 'password',
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setErrorMessage('');
    setSuccessMessage('');
    
    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setSuccessMessage('Your password has been updated.');
    router.push('/home');
  };

  return (
    <div>
      <h1>Reset Password</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="password">New password</label>
        <input
          id="password"
          type="password"
          {...register('password', {
            required: 'New password is required.',
            minLength: 8,
            pattern: {
              value:
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
              message:
                'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a symbol.',
            },
          })}
        />
        {errors.password?.message ? <p>{errors.password.message}</p> : null}

        <br />

        <label htmlFor="passwordConfirmation">Confirm new password</label>
        <input
          id="passwordConfirmation"
          type="password"
          {...register('passwordConfirmation', {
            required: 'Please confirm your new password.',
            validate: (value) =>
              value === passwordValue || 'Passwords do not match.',
          })}
        />
        {errors.passwordConfirmation?.message ? (
          <p>{errors.passwordConfirmation.message}</p>
        ) : null}

        <br />

        {errorMessage && (
          <p style={{ color: 'red' }}>{errorMessage}</p>
        )}
        {successMessage && (
          <p style={{ color: 'green' }}>{successMessage}</p>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}
