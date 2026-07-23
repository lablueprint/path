'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteStore } from '@/app/actions/store';
import { createClient } from '@/app/lib/supabase/browser-client';
import { Button } from 'react-bootstrap';
import ConfirmModal from '@/app/(main)/components/ConfirmModal';

type RemoveStoreButtonProps = {
  storeId: string;
};

export default function RemoveStoreButton({ storeId }: RemoveStoreButtonProps) {
  const router = useRouter();
  const supabase = createClient();

  const [isRemoving, setIsRemoving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    if (!isRemoving) {
      setShowModal(false);
      setErrorMessage('');
    }
  };

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
      setShowModal(false);
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
        className="btn-remove align-self-start"
        onClick={() => setShowModal(true)}
      >
        Remove
      </Button>
      <ConfirmModal
        show={showModal}
        title="Remove store?"
        message="Removing a store removes all associated store items, tickets, and carts for all users. This action cannot be undone."
        errorMessage={errorMessage}
        isLoading={isRemoving}
        onConfirm={handleDeletion}
        onClose={handleCloseModal}
      />
    </>
  );
}
