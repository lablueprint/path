'use client';

import { useForm } from 'react-hook-form';
import {
  updateStoreItemQuantity,
  updateStoreItemIsHidden,
} from '@/app/actions/store';
import styles from './StoreItemForm.module.css';

export default function StoreItemForm({
  storeId,
  storeItemId,
  itemName,
  categoryName,
  subcategoryName,
  description,
  photoUrl,
  quantity,
  visibility,
}: {
  storeId: string;
  storeItemId: string;
  itemName: string;
  categoryName: string;
  subcategoryName: string;
  description: string;
  photoUrl: string | null;
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
    <form onSubmit={handleSubmit(onSubmit)} className={styles.card}>
      <div className={styles.content}>
        <div className={styles.mediaColumn}>
          <div className={styles.photoFrame}>
            {photoUrl ? (
              <div
                className={styles.photoImage}
                style={{ backgroundImage: `url("${photoUrl}")` }}
                role="img"
                aria-label={itemName}
              />
            ) : (
              <div className={styles.placeholderImage} aria-hidden="true" />
            )}
          </div>
        </div>

        <div className={styles.detailsColumn}>
          <div className={styles.fieldGroup}>
            <p className={styles.fieldLabel}>Name</p>
            <p className={styles.fieldValue}>{itemName}</p>
          </div>

          <div className={styles.fieldGroup}>
            <p className={styles.fieldLabel}>Category</p>
            <p className={styles.fieldValue}>{categoryName}</p>
          </div>

          <div className={styles.fieldGroup}>
            <p className={styles.fieldLabel}>Subcategory</p>
            <p className={styles.fieldValue}>{subcategoryName}</p>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="quantityAvailable">
              Quantity
            </label>
            <input
              id="quantityAvailable"
              className={styles.quantityInput}
              type="number"
              min={0}
              step={1}
              placeholder="###"
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
              <p className={styles.errorText}>
                {errors.quantityAvailable.message}
              </p>
            )}
          </div>

          <label className={styles.checkboxRow}>
            <input
              className={styles.checkboxInput}
              type="checkbox"
              disabled={isSubmitting}
              {...register('isHidden')}
            />
            <span className={styles.checkboxLabel}>Is Hidden?</span>
          </label>

          <div className={styles.fieldGroup}>
            <p className={styles.fieldLabel}>Description</p>
            <p className={styles.descriptionText}>
              {description || 'No description provided.'}
            </p>
          </div>

          {isDirty && (
            <div>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => reset()}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
