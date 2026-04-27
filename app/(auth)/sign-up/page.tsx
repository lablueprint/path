'use client';

import { useForm, useWatch, SubmitHandler } from 'react-hook-form';
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
    control,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const passwordValue = useWatch({
    control,
    name: 'password',
  });

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    setIsLoading(true);
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
    setIsLoading(false);
    if (error) {
      alert(error.message);
      return;
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
      <br />
      <input
        {...register('lastName', { required: true })}
        placeholder="Last name"
        type="text"
      />
      {errors.lastName?.type === 'required' && (
        <p role="alert">Last name is required.</p>
      )}
      <br />
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
      <br />
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
          Password must be at least 8 characters and include an uppercase
          letter, a lowercase letter, a number, and a symbol.
        </p>
      )}
      {errors.password?.type === 'pattern' && (
        <p role="alert">
          Password must be at least 8 characters and include an uppercase
          letter, a lowercase letter, a number, and a symbol.
        </p>
      )}
      <br />
      <input
        {...register('passwordConfirmation', {
          required: true,
          validate: (value) =>
            value === passwordValue || 'Passwords do not match.',
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
      <br />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Sign up'}
      </button>
      <br />
      <Link href="/sign-in">Sign in</Link>
    </form>
  );
}
