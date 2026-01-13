'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { createClient } from '@/app/lib/supabase/browser-client';
import { useState } from 'react';
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
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const password = watch('password');

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    setAuthError(null);
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
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
      setAuthError(error.message);
      console.error('Sign up error: ', error);
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('firstName', { required: true })}
        placeholder="First Name"
        type="text"
      />
      {errors.firstName?.type === 'required' && (
        <p role="alert"> First name is required</p>
      )}

      <input
        {...register('lastName', { required: true })}
        placeholder="Last Name "
        type="text"
      />
      {errors.lastName?.type === 'required' && (
        <p role="alert"> Last name is required</p>
      )}

      <input
        {...register('email', {
          required: true,
          pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        })}
        placeholder="email"
      />
      {errors.email?.type === 'required' && (
        <p role="alert"> Email is required </p>
      )}
      {errors.email?.type === 'pattern' && <p role="alert">Invalid Email</p>}

      <input
        {...register('password', {
          required: true,
          minLength: 8,
          pattern:
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        })}
        placeholder= "password"
        //Minimum eight characters, at least one letter, one number and one special character
        type="password"
      />
      {errors.password?.type === 'required' && (
        <p role="alert">Password is required</p>
      )}
      {errors.password?.type === 'minLength' && (
        <p role="alert">Password must be at least 8 characters with one letter, one number, and one special character</p>
      )}
      {errors.password?.type === 'pattern' && (
        <p role="alert">
          Minimum eight characters, at least one letter, one number, and one
          special character
        </p>
      )}

      <input
        {...register('passwordConfirmation', {
          required: true,
          validate: (value) => value === password || "Passwords don't match",
        })}
        placeholder='confirm password'
        type="password"
      />
      {errors.passwordConfirmation?.type === 'required' && (
        <p role="alert">Please confirm your password</p>
      )}
      {errors.passwordConfirmation?.type === 'validate' && (
        <p role="alert">Passwords do not match</p>
      )}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating Account...' : 'Sign Up'}
        </button>
        <button >
            <a href="/sign-in">Sign in</a>
        </button>
    </form>
  );
}
