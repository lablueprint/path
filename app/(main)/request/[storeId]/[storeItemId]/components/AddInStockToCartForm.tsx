'use client';

import Form from 'next/form';
import Button from 'react-bootstrap/Button';
import BootstrapForm from 'react-bootstrap/Form';
import { addToCart } from '@/app/actions/ticket';
import styles from './AddInStockToCartForm.module.css';

interface AddInStockToCartFormProps {
  storeId: string;
  storeItemId: string;
}

export default function AddInStockToCartForm({
  storeId,
  storeItemId,
}: AddInStockToCartFormProps) {
  const handleSubmit = async (formData: FormData) => {
    const actualQuantity = Number(formData.get('quantity'));
    const { error: err } = await addToCart(
      storeId,
      storeItemId,
      actualQuantity,
    );
    if (err) {
      console.error('Error fetching ticket:', err);
    }
  };

  return (
    <Form action={handleSubmit} className={styles.formFields}>
      <BootstrapForm.Group className={styles.fieldGroup} controlId="quantity">
        <BootstrapForm.Label className={styles.fieldLabel}>
          Quantity
        </BootstrapForm.Label>
        <div className={styles.quantityRow}>
          <BootstrapForm.Control
            id="quantity"
            className={styles.quantityInput}
            name="quantity"
            type="number"
            min={1}
            step={1}
            placeholder="###"
            required
          />
        </div>
      </BootstrapForm.Group>

      <Button type="submit" className="align-self-start">
        Add to Cart
      </Button>
    </Form>
  );
}
