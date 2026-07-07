'use client';

import { useForm, useWatch } from 'react-hook-form';
import { createClient } from '@/app/lib/supabase/browser-client';
import { Button, Form } from 'react-bootstrap';

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
    mode: 'onChange',
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
        <Form onSubmit={handleSubmit(onSubmit)} className="form-body">
          <Form.Group>
            <label className="form-label field-label">New Password</label>
            <Form.Control
              type="password"
              {...register('newPassword', {
                minLength: 8,
                pattern:
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
              })}
              isInvalid={!!errors.newPassword}
            />
            <Form.Control.Feedback type="invalid">
              Password must be at least 8 characters and include an uppercase
              letter, a lowercase letter, a number, and a symbol.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <label className="form-label field-label">
              Confirm New Password
            </label>
            <Form.Control
              type="password"
              {...register('newPasswordConfirmation')}
              isInvalid={newPasswordConfirmation.length > 0 && !passwordsMatch}
            />
            <Form.Control.Feedback type="invalid">
              Passwords do not match.
            </Form.Control.Feedback>
          </Form.Group>
          <div className="btn-row">
            {passwordsMatch && (
              <Button className="btn-submit" type="submit">
                Save
              </Button>
            )}
            {(newPassword.length > 0 || newPasswordConfirmation.length > 0) && (
              <Button
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
              </Button>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
}
