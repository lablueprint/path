'use client';

import { deleteStoreItem } from '@/app/actions/store';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteStoreItemButton({
  storeItemId,
}: {
  storeItemId: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  async function handleDelete() {
    setErrorMessage('');
    setSuccessMessage('');
    const result = await deleteStoreItem(storeItemId);

    if (!result.success) {
      setErrorMessage('Failed to delete store item.' + result.error);
      return;
    }

    setSuccessMessage('Store item deleted successfully!');
    const targetPath = pathname.split('/').slice(0, -1).join('/') || '/';

    if (pathname === targetPath) {
      router.refresh();
      return;
    }

    router.push(targetPath);
  }

  return (
    <>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
      <button type="button" onClick={handleDelete}>
        Remove item
      </button>
    </>
  );
}
