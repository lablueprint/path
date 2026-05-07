'use client';

import { useForm, useWatch } from 'react-hook-form';
import { createClient } from '@/app/lib/supabase/browser-client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type ResetPasswordFormValues = {
  password: string;
  passwordConfirmation: string;
};

export default function ResetPasswordPage() {
  const supabase = createClient();
  const router = useRouter();

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
    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert('Your password has been updated.');
    router.push('/home');
  };

  return (
    <div className={'auth-form-wrap'}>
      <div className={'auth-left'}></div>
      <div className={'auth-right'}>
        <form className={'form-card auth'} onSubmit={handleSubmit(onSubmit)}>
          <Image width={96} height={46} src="/path.png" alt="path logo" />
          <p className={'auth-title'}>Reset Password</p>
          <div className={'auth-form-body'}>
            <input
              id="password"
              type="password"
              placeholder="New password"
              className={'auth-field first'}
              {...register('password', {
                required: 'New password is required.',
                minLength: 8,
                pattern: {
                  value:
                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                  message:
                    'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a symbol.',
                },
              })}
            />
            {errors.password?.message ? (
              <p className={'auth-error'}>{errors.password.message}</p>
            ) : null}

            <input
              id="passwordConfirmation"
              type="password"
              placeholder="Confirm new password"
              {...register('passwordConfirmation', {
                required: 'Please confirm your new password.',
                validate: (value) =>
                  value === passwordValue || 'Passwords do not match.',
              })}
              className={'auth-field'}
            />
            {errors.passwordConfirmation?.message ? (
              <p className={'auth-error'}>
                {errors.passwordConfirmation.message}
              </p>
            ) : null}
          </div>
          <div className={'submit-button-row'}>
            <button
              className={'btn-submit auth'}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
