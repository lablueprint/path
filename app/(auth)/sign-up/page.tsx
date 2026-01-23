'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { createClient } from '@/app/lib/supabase/browser-client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Inputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const password = watch('password');

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
        },
      },
    });
    setLoading(false);
    if (error) {
      console.error('Sign-up error:', error);
    }
    router.push('/home');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('firstName', { required: true })}
        placeholder="First name"
        type="text"
      />
      {errors.firstName?.type === 'required' && (
        <p role="alert">First name is required.</p>
      )}

      <input
        {...register('lastName', { required: true })}
        placeholder="Last name"
        type="text"
      />
      {errors.lastName?.type === 'required' && (
        <p role="alert">Last name is required.</p>
      )}

      <input
        {...register('email', {
          required: true,
          pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        })}
        placeholder="Email"
      />
      {errors.email?.type === 'required' && (
        <p role="alert">Email is required.</p>
      )}
      {errors.email?.type === 'pattern' && (
        <p role="alert">Enter a valid email.</p>
      )}

      <input
        {...register('password', {
          required: true,
          minLength: 8,
          pattern:
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        })}
        placeholder="Password"
        // Minimum eight characters, at least one letter, one number and one special character
        type="password"
      />
      {errors.password?.type === 'required' && (
        <p role="alert">Password is required.</p>
      )}
      {errors.password?.type === 'minLength' && (
        <p role="alert">
          Password must be at least 8 characters and include letters, numbers,
          and special characters.
        </p>
      )}
      {errors.password?.type === 'pattern' && (
        <p role="alert">
          Password must be at least 8 characters and include letters, numbers,
          and special characters.
        </p>
      )}

      <input
        {...register('passwordConfirmation', {
          required: true,
          validate: (value) => value === password || 'Passwords do not match.',
        })}
        placeholder="Confirm password"
        type="password"
      />
      {errors.passwordConfirmation?.type === 'required' && (
        <p role="alert">Please confirm your password.</p>
      )}
      {errors.passwordConfirmation?.type === 'validate' && (
        <p role="alert">Passwords do not match.</p>
      )}

      <button type="submit" disabled={loading}>
        {loading ? 'Creating account...' : 'Sign up'}
      </button>

      <Link href="/sign-in">Sign in</Link>
    </form>
  );
}
