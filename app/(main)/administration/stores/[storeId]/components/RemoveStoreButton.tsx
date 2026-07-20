'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteStore } from '@/app/actions/store';
import { createClient } from '@/app/lib/supabase/browser-client';
import { Button } from 'react-bootstrap';

type RemoveStoreButtonProps = {
  storeId: string;
};

export default function RemoveStoreButton({ storeId }: RemoveStoreButtonProps) {
  const router = useRouter();
  const supabase = createClient();

  const [isRemoving, setIsRemoving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleDeletion = async () => {
    setIsRemoving(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      // Remove photo from bucket first
      const { error: storageError } = await supabase.storage
        .from('store_photos')
        .remove([`${storeId}/store.jpg`]);
      const { success, error } = await deleteStore(storeId);
      if (storageError || !success) {
        setErrorMessage('Failed to remove store.');
        console.error(error);
        return;
      }
      setSuccessMessage('Store removed.');
      router.push('/administration/stores');
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
      <Button
        type="button"
        variant="outline-danger"
        onClick={handleDeletion}
        className="btn-remove"
      >
        {isRemoving ? 'Removing...' : 'Remove'}
      </Button>
    </>
  );
}
