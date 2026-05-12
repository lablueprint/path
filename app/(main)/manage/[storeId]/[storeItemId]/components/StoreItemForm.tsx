'use client';

import { useForm } from 'react-hook-form';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { updateStoreItemQuantity, updateStoreItemIsHidden,} from '@/app/actions/store';
import styles from './StoreItemForm.module.css';

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
    <Form onSubmit={handleSubmit(onSubmit)} className={styles.formFields}>
      <Form.Group className={styles.fieldGroup} controlId="quantityAvailable">
        <Form.Label className={styles.fieldLabel}>Quantity</Form.Label>
        <Form.Control
          className={styles.quantityInput}
          type="number"
          min={0}
          step={1}
          placeholder="###"
          disabled={isSubmitting}
          isInvalid={!!errors.quantityAvailable}
          {...register('quantityAvailable', {
            valueAsNumber: true,
            required: 'Please enter a numeric quantity.',
            validate: (v) =>
              (Number.isInteger(v) && v >= 0) ||
              'Please enter a combination of digits only (0-9).',
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.quantityAvailable?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className={styles.checkboxGroup} controlId="isHidden">
        <Form.Check
          type="checkbox"
          label="Is Hidden?"
          disabled={isSubmitting}
          {...register('isHidden')}
        />
      </Form.Group>

      {isDirty && (
        <div className="d-flex gap-2 align-self-start">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={isSubmitting}
            onClick={() => reset()}
          >
            Cancel
          </Button>
        </div>
      )}
    </Form>
  );
}
