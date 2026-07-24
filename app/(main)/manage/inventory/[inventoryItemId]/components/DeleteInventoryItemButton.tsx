'use client';

import { deleteItem } from '@/app/actions/inventory';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/app/lib/supabase/browser-client';
import { useState, useTransition } from 'react';
import { Button } from 'react-bootstrap';
import ConfirmModal from '@/app/(main)/components/ConfirmModal';

export default function DeleteInventoryItemButton({
  inventoryItemId,
}: {
  inventoryItemId: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

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
      // Remove photo from bucket first
      const { error: storageError } = await supabase.storage
        .from('inventory_item_photos')
        .remove([`${inventoryItemId}/item.jpg`]);
      const result = await deleteItem(inventoryItemId);

      if (storageError || !result.success) {
        setErrorMessage('Failed to remove item: ' + result.error);
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
        title="Remove inventory item?"
        message="Removing an inventory item removes all associated store items, ticket items, and cart items for all users. This action cannot be undone."
        errorMessage={errorMessage}
        isLoading={isPending}
        onConfirm={handleDelete}
        onClose={handleCloseModal}
      />
    </>
  );
}
