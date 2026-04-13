'use client';

import Form from 'next/form';
import { addToCart } from '@/app/actions/ticket';

interface AddOutOfStockToCartFormProps {
  storeId: string;
}

export default function AddOutOfStockToCartForm({
  storeId,
}: AddOutOfStockToCartFormProps) {
  const handleSubmit = async (formData: FormData) => {
    const description = formData.get('description') as string;
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

  return (
    <div>
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
