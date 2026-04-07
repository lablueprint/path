'use client';

import { deleteItem } from '@/app/actions/inventory';
import { useRouter } from 'next/navigation';

export default function DeleteInventoryItemButton({
  inventoryItemId,
}: {
  inventoryItemId: string;
}) {
  const router = useRouter();

  async function handleDelete() {
    const result = await deleteItem(inventoryItemId);

    if (!result.success) {
      console.error('Failed to delete inventory item:', result.error);
      return;
    }

    router.push('/manage/inventory');
  }

  return (
    <button type="button" onClick={handleDelete}>
      Remove item
    </button>
  );
}
