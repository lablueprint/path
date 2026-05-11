'use client';

import Form from 'next/form';
import { useState } from 'react';
import { addToCart } from '@/app/actions/ticket';
import SubmitButton from '@/app/(main)/request/components/SubmitButton';

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

  const handleSubmit = async (formData: FormData) => {
    setErrorMessage('');
    setSuccessMessage('');
    const actualQuantity = Number(formData.get('quantity'));
    const { error: err } = await addToCart(
      storeId,
      storeItemId,
      actualQuantity,
    );
    if (err) {
      setErrorMessage('Failed to add in-stock item to cart: ' + err);
      return;
    } else {
      setSuccessMessage('Item added to cart successfully!');
      return;
    }
  };

  return (
    <div>
      <Form action={handleSubmit}>
        <input
          name="quantity"
          type="number"
          placeholder="Type a quantity..."
          required
        />

        <SubmitButton />
      </Form>
      {errorMessage && <p>{errorMessage}</p>}
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
}
