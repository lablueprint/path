'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteStore } from '@/app/actions/store';
import { createClient } from '@/app/lib/supabase/browser-client';
import { Button, Alert } from 'react-bootstrap';

type RemoveStoreButtonProps = {
  storeId: string;
};

export default function RemoveStoreButton({ storeId }: RemoveStoreButtonProps) {
  const router = useRouter();
  const supabase = createClient();

  const [isRemoving, setIsRemoving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDeletion = async () => {
    setIsRemoving(true);
    setErrorMessage('');
    try {
      // Remove photo from bucket first
      const { error: storageError } = await supabase.storage
        .from('store_photos')
        .remove([`${storeId}/store.jpg`]);
      const { success, error } = await deleteStore(storeId);
      if (storageError || !success) {
        setErrorMessage('Failed to remove store: ' + error);
        return;
      }
      router.push('/administration/stores');
    } catch (error) {
      setErrorMessage('Failed to remove store: ' + error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline-danger"
        onClick={handleDeletion}
        className="btn-remove align-self-start"
        disabled={isRemoving}
      >
        {isRemoving ? 'Removing...' : 'Remove'}
      </Button>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
    </>
  );
}
