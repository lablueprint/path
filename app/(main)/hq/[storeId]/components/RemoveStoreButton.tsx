'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteStore } from '@/app/actions/store';

type RemoveStoreButtonProp = {
  storeId: string;
};

export default function RemoveStoreButton({ storeId }: RemoveStoreButtonProp) {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const handleDeletion = async () => {
    setIsRemoving(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const { success, error } = await deleteStore(storeId);
      if (!success) {
        setErrorMessage('Failed to remove store: ' + error);
        return;
      }

      setSuccessMessage('Store removed.');
      router.push('/hq');
    } catch (error) {
      setErrorMessage('Failed to remove store: ' + error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <>
      {errorMessage && <p role="alert">{errorMessage}</p>}
      {successMessage && <p role="status">{successMessage}</p>}
      <button type="button" onClick={handleDeletion} disabled={isRemoving}>
        {isRemoving ? 'Removing...' : 'Remove'}
      </button>
    </>
  );
}
