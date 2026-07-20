'use client';

import { useState, useTransition } from 'react';
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
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    setErrorMessage('');
    setSuccessMessage('');
    setFormErrorMessage(null);

    const actualQuantity = Number(formData.get('quantity'));

    if (!actualQuantity || actualQuantity < 1) {
      setFormErrorMessage('Please enter a valid quantity of 1 or more.');
      return;
    }
    startTransition(async () => {
      const { error: err } = await addToCart(
        storeId,
        storeItemId,
        actualQuantity,
      );
      if (err) {
        setErrorMessage('Failed to add in-stock item to cart: ' + err);
      } else {
        setSuccessMessage('Item added to cart.');
      }
    });
  };

  const handleInputChange = () => {
    if (formErrorMessage) {
      setFormErrorMessage(null);
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
          isInvalid={!!formErrorMessage}
          onChange={handleInputChange}
        />
        <Form.Control.Feedback type="invalid">
          {formErrorMessage}
        </Form.Control.Feedback>
      </Form.Group>
      {errorMessage && <p>{errorMessage}</p>}
      {successMessage && <p>{successMessage}</p>}
      <Button
        type="submit"
        className="align-self-start btn-submit"
        disabled={isPending}
      >
        {isPending ? 'Adding to Cart...' : 'Add to Cart'}
      </Button>
    </Form>
  );
}
