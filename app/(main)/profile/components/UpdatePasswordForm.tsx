'use client';

import { useForm, useWatch } from 'react-hook-form';
import { createClient } from '@/app/lib/supabase/browser-client';

type FormValues = {
  newPassword: string;
  newPasswordConfirmation: string;
};

export default function UpdatePasswordForm() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      newPassword: '',
      newPasswordConfirmation: '',
    },
  });

  const supabase = createClient();

  const newPassword = useWatch({
    control,
    name: 'newPassword',
  });

  const newPasswordConfirmation = useWatch({
    control,
    name: 'newPasswordConfirmation',
  });

  const passwordsMatch =
    newPassword.length > 0 &&
    newPasswordConfirmation.length > 0 &&
    newPassword === newPasswordConfirmation;

  const onSubmit = async (formData: FormValues) => {
    const { error } = await supabase.auth.updateUser({
      password: formData.newPassword,
    });

    if (error) {
      console.error('Password update error:', error);
      return;
    }

    reset();
  };

  return (
    <div className="form-card">
      <div className="card-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>Privacy</h2>
          <label className="field-label">New password</label>
          <input
            className="form-control"
            type="password"
            {...register('newPassword', {
              minLength: 8,
              pattern:
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
            })}
          />
          {errors.newPassword && (
            <p role="alert">
              Password must be at least 8 characters and include an uppercase
              letter, a lowercase letter, a number, and a symbol.
            </p>
          )}
          <br />
          <label className="field-label">Confirm new password</label>
          <input
            className="form-control"
            type="password"
            {...register('newPasswordConfirmation')}
          />

          {newPasswordConfirmation.length > 0 && !passwordsMatch && (
            <p role="alert">Passwords do not match.</p>
          )}
          <br />
          <div className="btn-row">
            {(newPassword.length > 0 || newPasswordConfirmation.length > 0) && (
              <button
                type="button"
                className="btn-cancel"
                onClick={() =>
                  reset({
                    newPassword: '',
                    newPasswordConfirmation: '',
                  })
                }
              >
                Cancel
              </button>
            )}
            {passwordsMatch && (
              <button className="btn-save" type="submit">
                Save
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
