'use client';
import { useForm } from 'react-hook-form';
import { createClient } from '@/app/lib/supabase/browser-client';
import Image from 'next/image';
import { Form } from 'react-bootstrap';
import pathLogo from '@/public/path.png';
import Link from 'next/link';

type ForgotPasswordFormValues = {
  email: string;
};

export default function ForgotPasswordPage() {
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: { email: '' },
    mode: 'onSubmit',
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    const { error } = await supabase.auth.resetPasswordForEmail(values.email);

    if (error) {
      alert(error.message);
      return;
    }

    alert('Instructions to reset your password have been sent to your email.');
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
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Please enter a valid email address.',
                  },
                })}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <div className={'submit-button-row'}>
              <button
                type="submit"
                className={'btn-submit auth'}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending' : 'Reset'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
