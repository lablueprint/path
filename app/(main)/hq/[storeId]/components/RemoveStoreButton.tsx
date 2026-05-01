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
        setErrorMessage(error ?? 'Failed to remove store.');
        return;
      }

      setSuccessMessage('Store removed. Redirecting...');
      router.push('/hq');
    } catch (error) {
      console.error('Store deletion error:', error);
      setErrorMessage('Failed to remove store. Please try again.');
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <>
      {errorMessage && <p role="alert">{errorMessage}</p>}
      {successMessage && <p role="status">{successMessage}</p>}
      <button type="button" onClick={handleDeletion} disabled={isRemoving}>
        {isRemoving ? 'Removing...' : 'Remove store'}
      </button>
    </>
  );
}
