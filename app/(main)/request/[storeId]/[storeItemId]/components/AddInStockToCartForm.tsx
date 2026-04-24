'use client';

import Form from 'next/form';
import { useState } from 'react';
import { addToCart } from '@/app/actions/ticket';

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

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add to Cart
        </button>
      </Form>
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
    </div>
  );
}
