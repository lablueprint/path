'use client';

import { useState } from 'react';
import { addToCart } from '@/app/actions/ticket';
import { Form, Button, Alert } from 'react-bootstrap';
import styles from '@/app/(main)/components/TicketDetails.module.css';

interface AddOutOfStockToCartFormProps {
  storeId: string;
}

export default function AddOutOfStockToCartForm({
  storeId,
}: AddOutOfStockToCartFormProps) {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setErrorMessage('');
    setSuccessMessage('');
    setFormErrorMessage(null);

    const description = formData.get('description') as string;

    if (!description) {
      setFormErrorMessage('Please enter a description.');
      return;
    }
    const { error: err } = await addToCart(
      storeId,
      undefined,
      undefined,
      description,
    );
    if (err) {
      setErrorMessage('Failed to add to cart: ' + err);
      return;
    } else {
      setSuccessMessage('Added to cart.');
    }
  };

  const handleInputChange = () => {
    if (formErrorMessage) {
      setFormErrorMessage(null);
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
              isInvalid={!!formErrorMessage}
              onChange={handleInputChange}
              rows={4}
            />
            <Form.Control.Feedback type="invalid">
              {formErrorMessage}
            </Form.Control.Feedback>
          </Form.Group>
          <Button type="submit" className="align-self-start btn-submit">
            Add to Cart
          </Button>
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        </Form>
      </div>
    </div>
  );
}
