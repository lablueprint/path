'use client';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { addToCart } from '@/app/actions/ticket';
import styles from '@/app/(main)/request/[storeId]/[storeItemId]/RequestStoreItemPage.module.css';

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
    <Form action={handleSubmit} className="form-body">
      <Form.Group>
        <Form.Label className={styles.fieldLabel}>Quantity</Form.Label>
        <Form.Control
          id="quantity"
          className={styles.quantityInput}
          name="quantity"
          type="number"
          min={1}
          step={1}
          required
        />
      </Form.Group>

        <button type="submit" className="btn-submit">
          Add to Cart
        </button>
      </Form>
  );
}
