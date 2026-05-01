'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { createStore } from '@/app/actions/store';

type FormValues = {
  storeName: string;
  storeStreetAddress: string;
};

export default function AddStoreForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { register, handleSubmit, control, reset } = useForm<FormValues>({
    defaultValues: {
      storeName: '',
      storeStreetAddress: '',
    },
  });

  const storeName = useWatch({
    control,
    name: 'storeName',
  });
  const storeStreetAddress = useWatch({
    control,
    name: 'storeStreetAddress',
  });

  const bothFilled =
    storeName.trim().length > 0 && storeStreetAddress.trim().length > 0;
  const eitherFilled =
    storeName.trim().length > 0 || storeStreetAddress.trim().length > 0;

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const result = await createStore({
        name: data.storeName,
        street_address: data.storeStreetAddress,
      });

      if (!result.success) {
        setErrorMessage(result.error ?? 'Failed to add store.');
        return;
      }

      reset({ storeName: '', storeStreetAddress: '' });
      setSuccessMessage('Store added.');
    } catch (error) {
      console.error('Store creation error:', error);
      setErrorMessage('Failed to add store. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Store name</label>
        <input {...register('storeName')} />
      </div>

      <div>
        <label>Store street address</label>
        <input {...register('storeStreetAddress')} />
      </div>

      {errorMessage && <p role="alert">{errorMessage}</p>}
      {successMessage && <p role="status">{successMessage}</p>}

      {bothFilled && (
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      )}

      {eitherFilled && (
        <button
          type="button"
          onClick={() => {
            setErrorMessage('');
            setSuccessMessage('');
            reset({ storeName: '', storeStreetAddress: '' });
          }}
          disabled={isSubmitting}
        >
          Cancel
        </button>
      )}
    </form>
  );
}
