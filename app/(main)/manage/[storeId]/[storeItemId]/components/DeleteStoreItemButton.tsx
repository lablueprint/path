'use client';

import { deleteStoreItem } from '@/app/actions/store';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Button } from 'react-bootstrap';
import ConfirmModal from '@/app/(main)/components/ConfirmModal';

export default function DeleteStoreItemButton({
  storeItemId,
  storeId,
}: {
  storeItemId: string;
  storeId: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    if (!isPending) {
      setShowModal(false);
      setErrorMessage('');
    }
  };

  async function handleDelete() {
    setErrorMessage('');
    startTransition(async () => {
      const result = await deleteStoreItem(storeItemId, storeId);

      if (!result.success) {
        setErrorMessage('Failed to delete store item: ' + result.error);
        return;
      }

      setShowModal(false);
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
        onClick={() => setShowModal(true)}
      >
        Remove
      </Button>
      <ConfirmModal
        show={showModal}
        title="Remove store item?"
        message="Removing a store item removes all associated ticket items and cart items for all users. This action cannot be undone."
        errorMessage={errorMessage}
        isLoading={isPending}
        onConfirm={handleDelete}
        onClose={handleCloseModal}
      />
    </>
  );
}
