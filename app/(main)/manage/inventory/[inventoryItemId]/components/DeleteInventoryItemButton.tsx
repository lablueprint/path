'use client';

import { deleteItem } from '@/app/actions/inventory';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

export default function DeleteInventoryItemButton({
  inventoryItemId,
}: {
  inventoryItemId: string;
}) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    setErrorMessage('');
    setSuccessMessage('');
    startTransition(async () => {
      const result = await deleteItem(inventoryItemId);

      if (!result.success) {
        setErrorMessage('Failed to remove item.');
        return;
      }

      setSuccessMessage('Item removed successfully!');
      router.push('/manage/inventory');
    });
  }

  return (
    <>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <button type="button" onClick={handleDelete} disabled={isPending}>
        {isPending ? 'Removing...' : 'Remove'}
      </button>
    </>
  );
}
