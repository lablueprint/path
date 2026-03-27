'use client';

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
    const qtyRes = await updateStoreItemQuantity(
      storeId,
      storeItemId,
      values.quantityAvailable,
    );

    if (!qtyRes.success) {
      alert(qtyRes.error ?? 'Failed to update quantity.');
      return;
    }

    const hiddenRes = await updateStoreItemIsHidden(
      storeId,
      storeItemId,
      values.isHidden,
    );

    if (!hiddenRes.success) {
      alert(hiddenRes.error ?? 'Failed to update visibility.');
      return;
    }

    reset(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Quantity available: </label>
        <input
          type="number"
          min={0}
          step={1}
          disabled={isSubmitting}
          {...register('quantityAvailable', {
            valueAsNumber: true,
            required: 'Please enter a numeric quantity.',
            validate: (v) =>
              (Number.isInteger(v) && v >= 0) ||
              'Please enter a combination of digits only (0-9).',
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
