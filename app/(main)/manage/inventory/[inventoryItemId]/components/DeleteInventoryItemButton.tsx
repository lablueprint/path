'use client';

import { deleteItem } from '@/app/actions/inventory';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Button, Alert } from 'react-bootstrap';

export default function DeleteInventoryItemButton({
  inventoryItemId,
}: {
  inventoryItemId: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    setErrorMessage('');
    startTransition(async () => {
      const result = await deleteItem(inventoryItemId);

      if (!result.success) {
        setErrorMessage('Failed to remove item: ' + result.error);
        return;
      }

      const targetPath = pathname.split('/').slice(0, -1).join('/') || '/';

      if (pathname === targetPath) {
        router.refresh();
        return;
      }

      router.push(targetPath);
    });
  }

  return (
    <>
      <Button
        type="button"
        variant="outline-danger"
        className="btn-remove align-self-start"
        onClick={handleDelete}
        disabled={isPending}
      >
        {isPending ? 'Removing...' : 'Remove'}
      </Button>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
    </>
  );
}
