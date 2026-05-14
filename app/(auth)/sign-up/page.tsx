'use client';

import { useForm, useWatch, SubmitHandler } from 'react-hook-form';
import { createClient } from '@/app/lib/supabase/browser-client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Form } from 'react-bootstrap';
type Inputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};
import pathLogo from '@/public/path.png';

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
          <Image width={96} height={46} src={pathLogo} alt="PATH logo" />
          <p className={'auth-title'}>Sign Up</p>
          <p className={'auth-prompt'}>
            Already a member?
            <Link href="/sign-in">Sign in</Link>
          </p>
          <div className={'auth-form-body'}>
            <Form.Group controlId="firstName">
              <Form.Control
                type="text"
                placeholder="First name"
                className="auth-field first"
                {...register('firstName', {
                  required: 'First name is required.',
                })}
                isInvalid={!!errors.firstName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.firstName?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="lastName">
              <Form.Control
                type="text"
                placeholder="Last name"
                className="auth-field"
                {...register('lastName', {
                  required: 'Last name is required.',
                })}
                isInvalid={!!errors.lastName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.lastName?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Control
                type="email"
                placeholder="Email"
                className="auth-field"
                {...register('email', {
                  required: 'Email is required.',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Enter a valid email.',
                  },
                })}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Control
                type="password"
                placeholder="Password"
                className="auth-field"
                {...register('password', {
                  required: 'Password is required.',
                  pattern: {
                    value:
                      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                    message:
                      'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a symbol.',
                  },
                })}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="passwordConfirmation">
              <Form.Control
                type="password"
                placeholder="Confirm password"
                className="auth-field"
                {...register('passwordConfirmation', {
                  required: 'Please confirm your password.',
                  validate: (value) =>
                    value === passwordValue || 'Passwords do not match.',
                })}
                isInvalid={!!errors.passwordConfirmation}
              />
              <Form.Control.Feedback type="invalid">
                {errors.passwordConfirmation?.message}
              </Form.Control.Feedback>
            </Form.Group>
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
