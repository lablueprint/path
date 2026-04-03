'use client';

import { addToCart } from '@/app/actions/ticket';

interface AddOutOfStockToCartFormProps {
  storeId: string;
}

export default function AddOutOfStockToCartForm({
  storeId,
}: AddOutOfStockToCartFormProps) {
  const handleSubmit = async (formData: FormData) => {
    const description = formData.get('description') as string;
    await addToCart(storeId, undefined, undefined, description);
  };

  return (
    <form action={handleSubmit}>
      <input
        name="description"
        type="text"
        placeholder="Describe the item..."
      />

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add to Cart
      </button>
    </form>
  );
}
