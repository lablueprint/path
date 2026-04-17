'use client';

import { useForm } from 'react-hook-form';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {
  updateStoreItemQuantity,
  updateStoreItemIsHidden,
} from '@/app/actions/store';
import styles from '@/app/(main)/manage/[storeId]/[storeItemId]/components/StoreItemForm.module.css';

type FormValues = {
  quantityAvailable: number;
  isHidden: boolean;
};

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
  } = useForm<FormValues>({
    defaultValues: {
      quantityAvailable: quantity,
      isHidden: visibility,
    },
  });

  const onSubmit = async ({ quantityAvailable, isHidden }: FormValues) => {
    const qtyRes = await updateStoreItemQuantity(
      storeId,
      storeItemId,
      quantityAvailable,
    );

    if (!qtyRes.success) {
      alert(qtyRes.error ?? 'Failed to update quantity.');
      return;
    }

    const hiddenRes = await updateStoreItemIsHidden(
      storeId,
      storeItemId,
      isHidden,
    );

    if (!hiddenRes.success) {
      alert(hiddenRes.error ?? 'Failed to update visibility.');
      return;
    }

    reset({ quantityAvailable, isHidden });
  };

  return (
    <form
      className={`d-flex flex-column gap-3 ${styles.form}`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="row g-4">
        <div className="col-12 col-md-6">
          <Form.Group className={styles.field} controlId="quantityAvailable">
            <Form.Label className={styles.label}>Quantity</Form.Label>
            <Form.Control
              className={styles.input}
              type="number"
              min={0}
              step={1}
              disabled={isSubmitting}
              {...register('quantityAvailable', {
                valueAsNumber: true,
                required: 'Please enter a numeric quantity.',
                validate: (value) =>
                  (Number.isInteger(value) && value >= 0) ||
                  'Please enter a combination of digits only (0-9).',
              })}
            />

            {errors.quantityAvailable?.message ? (
              <p className={styles.error}>{errors.quantityAvailable.message}</p>
            ) : null}
          </Form.Group>
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="isHidden" className={styles.checkboxRow}>
            <input
              id="isHidden"
              className={styles.checkbox}
              type="checkbox"
              disabled={isSubmitting}
              {...register('isHidden')}
            />
            <span>Is hidden?</span>
          </label>
        </div>
      </div>

      {isDirty && (
        <div className={`d-flex flex-wrap gap-3 ${styles.actions}`}>
          <Button
            className={styles.primaryButton}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
          <Button
            className={styles.secondaryButton}
            type="button"
            disabled={isSubmitting}
            onClick={() => reset()}
          >
            Cancel
          </Button>
        </div>
      )}
    </form>
  );
}
