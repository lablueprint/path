'use client';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { createClient } from '@/app/lib/supabase/browser-client';

type ForgotPasswordFormValues = {
  email: string;
};

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: { email: '' },
    mode: 'onSubmit',
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setErrorMessage('');
    setSuccessMessage('');

    const { error } = await supabase.auth.resetPasswordForEmail(values.email);

    if (error) {
      setErrorMessage('Failed to send reset password email: ' + error.message);
      return;
    }

    setSuccessMessage(
      'Instructions to reset your password have been sent to your email.',
    );
  };

  return (
    <div>
      <h1>Reset Password</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email">Email</label>

        <input
          id="email"
          type="email"
          {...register('email', {
            required: 'Email is required.',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Please enter a valid email address.',
            },
          })}
        />

        {errors.email?.message ? <p>{errors.email.message}</p> : null}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending' : 'Reset password'}
        </button>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      </form>
    </div>
  );
}
