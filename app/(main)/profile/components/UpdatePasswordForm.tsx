'use client';

import { useForm } from 'react-hook-form';

type FormValues = {
  newPassword: string;
  newPasswordConfirmation: string;
};

export function UpdatePasswordForm() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      newPassword: '',
      newPasswordConfirmation: '',
    },
  });

  const newPassword = watch('newPassword');
  const newPasswordConfirmation = watch('newPasswordConfirmation');

  const onSubmit = (values: FormValues) => {
    console.log('Submitted:', values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>New password</label>
      <input
        type="password"
        placeholder="Password"
        {...register('newPassword', {
          required: true,
          minLength: 8,
          pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        })}
      />
        {errors.newPassword?.type === 'required' && (
        <p role="alert">Password is required.</p>
        )}
        {errors.newPassword?.type === 'minLength' && (
        <p role="alert">Password must be at least 8 characters.</p>
        )}
        {errors.newPassword?.type === 'pattern' && (
        <p role="alert">Password does not meet requirements.</p>
        )}

      <br />

      <label>New password confirmation</label>
      <input
        type="password"
        {...register('newPasswordConfirmation')}
      />
      <br />

      <button type="button" onClick={() => reset()}>
        Cancel
      </button>
      <button type="submit">
        Save
      </button>

      <div style={{ marginTop: 12 }}>
        <div>newPassword length: {newPassword.length}</div>
        <div>confirmation length: {newPasswordConfirmation.length}</div>
      </div>
    </form>
  );
}
