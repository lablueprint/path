'use client';

import { useForm, useWatch, SubmitHandler } from 'react-hook-form';
import { createClient } from '@/app/lib/supabase/browser-client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
    formState: { errors },
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
      console.error('Sign-up error:', error);
    }
    router.push('/home');
  };

  return (
    <div className={'auth-form-wrap'}>
      <div className={'auth-left'}></div>
      <div className={'auth-right'}>
        <form className={'form-card auth'} onSubmit={handleSubmit(onSubmit)}>
          <Image width={96} height={46} src="/path.png" alt="path logo" />
          <p className={'auth-title'}>Sign Up</p>
          <p className={'auth-prompt'}>
            Already a member?
            <Link href="/sign-in">Sign in</Link>
          </p>
          <div className={'auth-form-body'}>
            <input
              {...register('firstName', { required: true })}
              placeholder="First name"
              type="text"
              className={'auth-field first'}
            />
            {errors.firstName?.type === 'required' && (
              <p role="alert" className="auth-error">
                First name is required.
              </p>
            )}
            <input
              {...register('lastName', { required: true })}
              placeholder="Last name"
              type="text"
              className={'auth-field'}
            />
            {errors.lastName?.type === 'required' && (
              <p role="alert" className="auth-error">
                Last name is required.
              </p>
            )}
            <input
              {...register('email', {
                required: true,
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              })}
              placeholder="Email"
              className={'auth-field'}
            />
            {errors.email?.type === 'required' && (
              <p role="alert" className="auth-error">
                Email is required.
              </p>
            )}
            {errors.email?.type === 'pattern' && (
              <p role="alert" className="auth-error">
                Enter a valid email.
              </p>
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
              className={'auth-field'}
            />
            {errors.password?.type === 'required' && (
              <p role="alert" className="auth-error">
                Password is required.
              </p>
            )}
            {errors.password?.type === 'minLength' && (
              <p role="alert" className="auth-error">
                Password must be at least 8 characters and include an uppercase
                letter, a lowercase letter, a number, and a symbol.
              </p>
            )}
            {errors.password?.type === 'pattern' && (
              <p role="alert" className="auth-error">
                Password must be at least 8 characters and include an uppercase
                letter, a lowercase letter, a number, and a symbol.
              </p>
            )}
            <input
              {...register('passwordConfirmation', {
                required: true,
                validate: (value) =>
                  value === passwordValue || 'Passwords do not match.',
              })}
              placeholder="Confirm password"
              type="password"
              className={'auth-field'}
            />
            {errors.passwordConfirmation?.type === 'required' && (
              <p role="alert" className="auth-error">
                Please confirm your password.
              </p>
            )}
            {errors.passwordConfirmation?.type === 'validate' && (
              <p role="alert" className="auth-error">
                Passwords do not match.
              </p>
            )}
          </div>
          <div className={'submit-button-row'}>
            <button
              className={'btn-submit auth'}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
