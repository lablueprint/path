'use client';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { createClient } from '@/app/lib/supabase/browser-client';
import Image from 'next/image';
import { Form, Button } from 'react-bootstrap';
import pathLogo from '@/public/path.png';
import Link from 'next/link';

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
    <div className={'auth-form-wrap'}>
      <div className={'auth-left'}></div>
      <div className={'auth-right'}>
        <form className={'form-card auth'} onSubmit={handleSubmit(onSubmit)}>
          <Link href="/home">
            <Image
              width={96}
              height={46}
              src={pathLogo}
              alt="PATH logo"
              priority
            />
          </Link>
          <p className={'auth-title'}>Reset Password</p>

          <div className={'form-body'}>
            <p className={'auth-prompt'}>
              We&apos;ll send a link to your email.
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
                    message: 'Please enter a valid email address.',
                  },
                })}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <div className={'auth-btn-row'}>
              <Button
                type="submit"
                className={'btn-submit'}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Reset'}
              </Button>
            </div>
          </div>

          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </form>
      </div>
    </div>
  );
}
