'use client';

import { useState } from 'react';
import { addToCart } from '@/app/actions/ticket';
import { Form, Button } from 'react-bootstrap';
import styles from '@/app/(main)/components/TicketDetails.module.css';

interface AddOutOfStockToCartFormProps {
  storeId: string;
}

export default function AddOutOfStockToCartForm({
  storeId,
}: AddOutOfStockToCartFormProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setErrorMessage(null);

    const description = formData.get('description') as string;

    if (!description) {
      setErrorMessage('Please enter a description.');
      return;
    }
    const { error: err } = await addToCart(
      storeId,
      undefined,
      undefined,
      description,
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
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>New Out-of-Stock Request</h2>
      </div>
      <div className={styles.cardBody}>
        <Form action={handleSubmit} className="form-body">
          <Form.Group>
            <Form.Control
              name="description"
              as="textarea"
              placeholder="Description of item..."
              isInvalid={!!errorMessage}
              onChange={handleInputChange}
              rows={4}
            />
            <Form.Control.Feedback type="invalid">
              {errorMessage}
            </Form.Control.Feedback>
          </Form.Group>
          <Button type="submit" className="align-self-start btn-submit">
            Add to Cart
          </Button>
        </Form>
      </div>
    </div>
  );
}
