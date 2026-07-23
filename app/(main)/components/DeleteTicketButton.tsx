'use client';

import { deleteTicket } from '@/app/actions/ticket';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from 'react-bootstrap';
import { useState, useTransition } from 'react';
import ConfirmModal from '@/app/(main)/components/ConfirmModal';

export default function DeleteTicketButton({ ticketId }: { ticketId: string }) {
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
      const result = await deleteTicket(ticketId);

      if (!result.success) {
        setErrorMessage('Failed to remove ticket.');
        return;
      }

      setShowModal(false);
      const parentPath = pathname.split('/').slice(0, -1).join('/') || '/';
      router.push(parentPath);
    });
  }

  return (
    <>
      <Button
        variant="outline-danger"
        className="btn-remove btn-sm align-self-start align-self-md-end"
        onClick={() => setShowModal(true)}
      >
        Remove
      </Button>
      <ConfirmModal
        show={showModal}
        title="Remove ticket?"
        message="This action cannot be undone."
        errorMessage={errorMessage}
        isLoading={isPending}
        onConfirm={handleDelete}
        onClose={handleCloseModal}
      />
    </>
  );
}
