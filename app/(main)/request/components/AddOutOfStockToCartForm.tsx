'use client';

import Form from 'next/form';
import { useState } from 'react';
import { addToCart } from '@/app/actions/ticket';
import SubmitButton from '@/app/(main)/request/components/SubmitButton';

interface AddOutOfStockToCartFormProps {
  storeId: string;
}

export default function AddOutOfStockToCartForm({
  storeId,
}: AddOutOfStockToCartFormProps) {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const handleSubmit = async (formData: FormData) => {
    setErrorMessage('');
    setSuccessMessage('');
    const description = formData.get('description') as string;
    const { error: err } = await addToCart(
      storeId,
      undefined,
      undefined,
      description,
    );
    if (err) {
      setErrorMessage('Failed to add item to cart: ' + err);
      return;
    } else {
      setSuccessMessage('Item added to cart successfully!');
    }
  };

  return (
    <div>
      {errorMessage && <p>{errorMessage}</p>}
      {successMessage && <p>{successMessage}</p>}
      <Form action={handleSubmit}>
        <input
          name="description"
          type="text"
          placeholder="Description of item..."
        />
        <SubmitButton />
      </Form>
    </div>
  );
}
