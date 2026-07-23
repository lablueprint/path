'use client';

import { createClient } from '@/app/lib/supabase/browser-client';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Form, Alert } from 'react-bootstrap';
import pathLogo from '@/public/path.png';

type Inputs = {
  email: string;
  password: string;
};

export default function SignInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();
  const [errorMessage, setErrorMessage] = useState('');
  const supabase = createClient();

  const onSubmit = async (formData: Inputs) => {
    setErrorMessage('');
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });
    if (error) {
      setErrorMessage(error.message ?? 'Failed to sign in.');
      return;
    }
    window.location.assign('/home');
  };

  return (
    <div className="auth-form-wrap">
      <div className="auth-left" />
      <div className="auth-right">
        <form className="form-card auth" onSubmit={handleSubmit(onSubmit)}>
          <Link href="/home">
            <Image
              width={96}
              height={46}
              src={pathLogo}
              alt="PATH logo"
              priority
            />
          </Link>
          <p className="auth-title">Sign In</p>
          <div className="form-body">
            <p className="auth-prompt">
              Not a member?{' '}
              <Link className="auth-link" href="/sign-up">
                Sign up
              </Link>
            </p>
            <Form.Group controlId="email">
              <Form.Control
                type="email"
                placeholder="Email"
                className="auth-field first"
                {...register('email', {
                  required: 'Email is required.',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email.',
                  },
                })}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid" className="auth-error">
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
                })}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Link className="forgot-password" href="/forgot-password">
              Forgot password?
            </Link>
            <div className="auth-btn-row">
              <Button
                type="submit"
                className="btn-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </Button>
            </div>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          </div>
        </form>
      </div>
    </div>
  );
}
