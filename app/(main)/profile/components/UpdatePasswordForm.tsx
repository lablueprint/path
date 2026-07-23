'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { createClient } from '@/app/lib/supabase/browser-client';
import { Button, Form, Alert } from 'react-bootstrap';

type FormValues = {
  newPassword: string;
  newPasswordConfirmation: string;
};

export default function UpdatePasswordForm() {
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'onSubmit',
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
    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword,
      });

      if (error) {
        console.error('Password update error:', error);
        setErrorMessage(error.message ?? 'Failed to update password.');
        return;
      }

      setSuccessMessage('Password updated.');
      reset();
    } catch (error) {
      console.error('Password update error:', error);
      setErrorMessage('Failed to update password. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    reset({
      newPassword: '',
      newPasswordConfirmation: '',
    });
    setErrorMessage('');
    setSuccessMessage('');
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
                required: 'Password is required.',
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*\(\)_\+\-=\[\]\{\};'\\:"\|<>\?,\./`~])[A-Za-z\d!@#\$%\^&\*\(\)_\+\-=\[\]\{\};'\\:"\|<>\?,\./`~]{8,}$/,
                  message:
                    'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a symbol.',
                },
              })}
              isInvalid={!!errors.newPassword}
            />
            <Form.Control.Feedback type="invalid">
              {errors.newPassword?.message}
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

          {(newPassword.length > 0 || newPasswordConfirmation.length > 0) && (
            <div className="btn-row">
              {passwordsMatch && (
                <Button
                  className="btn-submit"
                  type="submit"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              )}
              <Button
                type="button"
                className="btn-cancel"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          )}

          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        </Form>
      </div>
    </div>
  );
}
