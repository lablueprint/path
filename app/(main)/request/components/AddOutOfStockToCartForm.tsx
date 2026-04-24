'use client';

import Form from 'next/form';
import { useState } from 'react';
import { addToCart } from '@/app/actions/ticket';

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
      {errorMessage && (
        <div
          style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '12px',
            borderRadius: '5px',
            marginBottom: '15px',
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div
          style={{
            backgroundColor: '#d4edda',
            color: '#155724',
            padding: '12px',
            borderRadius: '5px',
            marginBottom: '15px',
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          {successMessage}
        </div>
      )}
      <Form action={handleSubmit}>
        <input
          name="description"
          type="text"
          placeholder="Description of item..."
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add to Cart
        </button>
      </Form>
    </div>
  );
}
