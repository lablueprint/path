'use client';

import { createClient } from '@/app/lib/supabase/browser-client';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('email', {
          pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          required: true,
        })}
        placeholder="Email"
      />
      {errors.email?.type === 'required' && (
        <p role="alert">Email is required.</p>
      )}
      {errors.email?.type === 'pattern' && (
        <p role="alert">Please enter a valid email.</p>
      )}
      <br />
      <input
        {...register('password', { required: true })}
        placeholder="Password"
        type="password"
      />
      {errors.password?.type === 'required' && (
        <p role="alert">Password is required.</p>
      )}
      <br />
      <button type="submit">Sign in</button>
      <br />
      <Link href = "/forgot-password">Forgot password?</Link>
      <br />
      <Link href="/sign-up">Sign up</Link>
    </form>
  );
}
