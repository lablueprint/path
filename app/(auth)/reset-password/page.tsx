'use client';

import { useForm, useWatch } from 'react-hook-form';
import { createClient } from '@/app/lib/supabase/browser-client';
import Image from 'next/image';
import { Button, Form } from 'react-bootstrap';
import pathLogo from '@/public/path.png';
import Link from 'next/link';
import { useState } from 'react';

type ResetPasswordFormValues = {
  password: string;
  passwordConfirmation: string;
};

export default function ResetPasswordPage() {
  const supabase = createClient();
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
    window.location.assign('/home');
  };

  return (
    <div className={'auth-form-wrap'}>
      <div className={'auth-left'} />
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
            <div className={'auth-prompt'} />
            <Form.Group controlId="password">
              <Form.Control
                type="password"
                placeholder="New Password"
                className="auth-field first"
                {...register('password', {
                  required: 'Password is required.',
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*\(\)_\+\-=\[\]\{\};'\\:"\|<>\?,\./`~])[A-Za-z\d!@#\$%\^&\*\(\)_\+\-=\[\]\{\};'\\:"\|<>\?,\./`~]{8,}$/,
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
                placeholder="Confirm New Password"
                className="auth-field"
                {...register('passwordConfirmation', {
                  required: 'Please confirm your new password.',
                  validate: (value) =>
                    value === passwordValue || 'Passwords do not match.',
                })}
                isInvalid={!!errors.passwordConfirmation}
              />
              <Form.Control.Feedback type="invalid">
                {errors.passwordConfirmation?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <div className={'auth-btn-row'}>
              <Button
                className={'btn-submit auth'}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </div>

            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {successMessage && (
              <p style={{ color: 'green' }}>{successMessage}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
