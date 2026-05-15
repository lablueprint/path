'use client';

import { useForm, useWatch, SubmitHandler, Controller } from 'react-hook-form';
import { createClient } from '@/app/lib/supabase/browser-client';
import { forwardRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Form } from 'react-bootstrap';
import type { FormControlProps } from 'react-bootstrap';
import { PatternFormat } from 'react-number-format';

type Inputs = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirmation: string;
};
import pathLogo from '@/public/path.png';

const BootstrapInput = forwardRef<HTMLInputElement, FormControlProps>(
  (props, ref) => <Form.Control {...props} ref={ref} />,
);
BootstrapInput.displayName = 'BootstrapInput';

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
          phone: formData.phone,
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
          <Link href="/home">
            <Image
              width={96}
              height={46}
              src={pathLogo}
              alt="PATH logo"
              priority
            />
          </Link>
          <p className={'auth-title'}>Sign Up</p>
          <div className={'form-body'}>
            <p className={'auth-prompt'}>
              Already a member?{' '}
              <Link className={'auth-link'} href="/sign-in">
                Sign in
              </Link>
            </p>

            <Form.Group controlId="firstName">
              <Form.Control
                type="text"
                placeholder="First Name"
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
                placeholder="Last Name"
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
            <Form.Group controlId="phone">
              <Controller
                name="phone"
                control={control}
                rules={{
                  validate: (value) => {
                    const digits = value?.replace(/\D/g, '');
                    return (
                      !digits ||
                      digits.length === 10 ||
                      'Phone number must be 10 digits'
                    );
                  },
                }}
                render={({ field }) => (
                  <PatternFormat
                    {...field}
                    format="(###) ###-####"
                    mask="_"
                    placeholder="Phone Number (Optional)"
                    allowEmptyFormatting
                    onValueChange={(values) => {
                      field.onChange(values.value);
                    }}
                    customInput={BootstrapInput}
                    isInvalid={!!errors.phone}
                    className="auth-field"
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phone?.message}
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
                placeholder="Confirm Password"
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

            <div className={'submit-button-row'}>
              <button
                className={'btn-submit auth'}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Sign Up'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
