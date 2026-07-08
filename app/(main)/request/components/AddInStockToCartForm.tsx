'use client';

import { useState } from 'react';
import { addToCart } from '@/app/actions/ticket';
import styles from '@/app/(main)/request/[storeId]/[storeItemId]/RequestStoreItemPage.module.css';
import { Form, Button } from 'react-bootstrap';

interface AddInStockToCartFormProps {
  storeId: string;
  storeItemId: string;
}

export default function AddInStockToCartForm({
  storeId,
  storeItemId,
}: AddInStockToCartFormProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setErrorMessage(null);

    const actualQuantity = Number(formData.get('quantity'));

    if (!actualQuantity || actualQuantity < 1) {
      setErrorMessage('Please enter a valid quantity of 1 or more.');
      return;
    }
    const { error: err } = await addToCart(
      storeId,
      storeItemId,
      actualQuantity,
    );
    if (err) {
      console.error('Error fetching ticket:', err);
    }
  };

  const handleInputChange = () => {
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  return (
    <Form action={handleSubmit} className="form-body">
      <Form.Group>
        <Form.Label className={styles.fieldLabel}>Quantity</Form.Label>
        <Form.Control
          id="quantity"
          className={styles.quantityInput}
          name="quantity"
          type="number"
          step={1}
          isInvalid={!!errorMessage}
          onChange={handleInputChange}
        />
        <Form.Control.Feedback type="invalid">
          {errorMessage}
        </Form.Control.Feedback>
      </Form.Group>
      <Button type="submit" className="align-self-start btn-submit">
        Add to Cart
      </Button>
    </Form>
  );
}
