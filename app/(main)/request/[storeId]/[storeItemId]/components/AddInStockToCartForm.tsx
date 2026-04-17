'use client';

import { addToCart } from '@/app/actions/ticket';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import styles from '@/app/(main)/request/[storeId]/[storeItemId]/components/AddInStockToCartForm.module.css';

interface AddInStockToCartFormProps {
  storeId: string;
  storeItemId: string;
}

export default function AddInStockToCartForm({
  storeId,
  storeItemId,
}: AddInStockToCartFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const actualQuantity = Number(formData.get('quantity'));
      const { error } = await addToCart(storeId, storeItemId, actualQuantity);

      if (error) {
        console.error('Error adding item to cart:', error);
        setErrorMessage(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      action={handleSubmit}
      className={`d-flex flex-column gap-3 ${styles.form}`}
    >
      <Form.Group className={styles.field} controlId="quantity">
        <Form.Label className={styles.label}>Quantity</Form.Label>
        <Form.Control
          className={styles.input}
          name="quantity"
          type="number"
          min={1}
          step={1}
          placeholder="###"
          required
        />
      </Form.Group>

      <div className="d-flex flex-column flex-sm-row align-items-start gap-3">
        <Button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add to cart'}
        </Button>

        {errorMessage ? (
          <p className={`mb-0 ${styles.error}`}>{errorMessage}</p>
        ) : null}
      </div>
    </form>
  );
}
