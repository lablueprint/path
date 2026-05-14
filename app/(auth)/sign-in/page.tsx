'use client';

import { createClient } from '@/app/lib/supabase/browser-client';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Form } from 'react-bootstrap';
import pathLogo from '@/public/path.png';

type Inputs = {
  email: string;
  password: string;
};

export default function SignInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const router = useRouter();
  const supabase = createClient();

  const onSubmit = async (formData: Inputs) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });
    if (error) {
      alert(error.message);
      return;
    }
    router.push('/home');
  };

  return (
    <div className={'auth-form-wrap'}>
      <div className={'auth-left'}></div>
      <div className={'auth-right'}>
        <form className={'form-card auth'} onSubmit={handleSubmit(onSubmit)}>
          <Image width={96} height={46} src={pathLogo} alt="PATH logo" />
          <p className={'auth-title'}>Sign In</p>
          <p className={'auth-prompt'}>
            Not a member?
            <Link className={'auth-link'} href="/sign-up">
              Sign up
            </Link>
          </p>
          <div className={'auth-form-body'}>
            <Form.Group controlId="email">
              <Form.Control
                type="email"
                placeholder="Email"
                className="auth-field first"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
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
                  required: 'Password is required',
                })}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </div>
          <Link className={'forgot-password'} href="/forgot-password">
            Forgot password?
          </Link>
          <div className={'submit-button-row'}>
            <button type="submit" className={'btn-submit auth'}>
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
