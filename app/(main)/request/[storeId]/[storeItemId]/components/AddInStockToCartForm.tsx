'use client';

import Form from 'next/form';
import { addToCart } from '@/app/actions/ticket';

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
    </div>
  );
}
