'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Store } from '@/app/types/store';
import { updateStore } from '@/app/actions/store';

type FormValues = {
  name: string;
  street_address: string;
};

export default function EditStoreForm({ store }: { store: Store }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { register, handleSubmit, formState, reset } = useForm<FormValues>({
    defaultValues: {
      name: store.name,
      street_address: store.street_address,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const result = await updateStore(store.store_id, data);
      if (!result.success) {
        setErrorMessage(result.error ?? 'Failed to update store.');
        return;
      }

      reset(data);
      setSuccessMessage('Store updated.');
    } catch (error) {
      console.error('Store update error:', error);
      setErrorMessage('Failed to update store. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Store name</label>
        <input {...register('name')} />
      </div>
      <div>
        <label>Store street address</label>
        <input {...register('street_address')} />
      </div>

      {errorMessage && <p role="alert">{errorMessage}</p>}
      {successMessage && <p role="status">{successMessage}</p>}

      {formState.isDirty && (
        <>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => {
              setErrorMessage('');
              setSuccessMessage('');
              reset({
                name: store.name,
                street_address: store.street_address,
              });
            }}
          >
            Cancel
          </button>
        </>
      )}
    </form>
  );
}
