'use client';

import { createClient } from '@/app/lib/supabase/browser-client';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
          <Image width={96} height={46} src="/path.png" alt="path logo" />
          <p className={'auth-title'}>Sign In</p>
          <p className={'auth-prompt'}>
            Not a member?
            <Link className={'auth-link'} href="/sign-up">
              Sign up
            </Link>
          </p>
          <div className={'auth-form-body'}>
            <input
              {...register('email', {
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                required: true,
              })}
              placeholder="Email"
              className={'auth-field first'}
            />
            {errors.email?.type === 'required' && (
              <p role="alert" className="auth-error">
                Email is required.
              </p>
            )}
            {errors.email?.type === 'pattern' && (
              <p role="alert" className="auth-error">
                Please enter a valid email.
              </p>
            )}
            <input
              {...register('password', { required: true })}
              placeholder="Password"
              type="password"
              className={'auth-field'}
            />
            {errors.password?.type === 'required' && (
              <p role="alert" className="auth-error">
                Password is required.
              </p>
            )}
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
