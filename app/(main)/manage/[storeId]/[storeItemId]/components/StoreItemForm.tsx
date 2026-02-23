'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  updateStoreItemQuantity,
  updateStoreItemIsHidden,
} from '@/app/actions/store';

export default function StoreItemForm({
  storeId,
  storeItemId,
  quantity,
  visibility,
}: {
  storeId: string;
  storeItemId: string;
  quantity: number;
  visibility: boolean;
}) {
  const [saveError, setSaveError] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, errors, isSubmitting },
  } = useForm({
    defaultValues: {
      quantityAvailable: quantity,
      isHidden: visibility,
    },
  });

  const onSubmit = async (values: {
    quantityAvailable: number;
    isHidden: boolean;
  }) => {
    setSaveError('');

    try {
      await updateStoreItemQuantity(
        storeId,
        storeItemId,
        values.quantityAvailable,
      );
      await updateStoreItemIsHidden(storeId, storeItemId, values.isHidden);
      reset(values);
    } catch (e: any) {
      setSaveError(e?.message ?? 'Failed to save changes.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div style={{ marginBottom: '14px' }}>
        <label>Quantity available: </label>
        <input
          type="number"
          min={0}
          step={1}
          disabled={isSubmitting}
          {...register('quantityAvailable', {
            valueAsNumber: true,
            required: 'Error: Please enter a numeric quantity (or cancel).', // for empty input
            validate: (v) =>
              (Number.isInteger(v) && v >= 0) ||
              'Error: Please enter a combination of digits only (0-9).',
          })}
        />

        {errors.quantityAvailable && (
          <div style={{ color: 'red' }}>{errors.quantityAvailable.message}</div>
        )}
      </div>

      <div>
        <label>Hidden? </label>
        <input
          type="checkbox"
          disabled={isSubmitting}
          {...register('isHidden')}
        />
      </div>

      {isDirty && (
        <div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
          <button type="button" disabled={isSubmitting} onClick={() => reset()}>
            Cancel
          </button>
        </div>
      )}
    </form>
  );
}
