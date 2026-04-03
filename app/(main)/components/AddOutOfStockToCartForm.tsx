'use client';

import Form from 'next/form';
import { addToCart } from '@/app/actions/ticket';

interface AddOutOfStockToCartFormProps {
  storeId: string;
  storeItemId?: string;
  quantity?: number;
}

export default function AddOutOfStockToCartForm({
  storeId,
  storeItemId,
  quantity,
}: AddOutOfStockToCartFormProps) {
  const handleSubmit = async (formData: FormData) => {
    const description = formData.get('description') as string;
    const { data: cartItem, error: err } = await addToCart(
      storeId,
      storeItemId,
      quantity,
      description,
    );
    if (err) {
      console.error('Error fetching ticket:', err);
    }
    console.log(cartItem);
  };

  return (
    <Form action={handleSubmit}>
      <input
        name="description"
        type="text"
        placeholder="Description for items..."
      />

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add to Cart
      </button>
    </Form>
  );
}
