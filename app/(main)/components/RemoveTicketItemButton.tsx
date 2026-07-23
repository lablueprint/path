'use client';

import { deleteTicketItem } from '@/app/actions/ticket';
import { useState, useTransition } from 'react';
import { Button, Alert } from 'react-bootstrap';

type RemoveTicketItemButtonProps = {
  ticketItemId: string;
};

export default function RemoveTicketItemButton({
  ticketItemId,
}: RemoveTicketItemButtonProps) {
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    setErrorMessage('');
    startTransition(async () => {
      const { success, error } = await deleteTicketItem(ticketItemId);
      if (!success) {
        setErrorMessage('Failed to remove ticket item.' + error);
        return;
      }
    });
  };

  return (
    <>
      <Button
        variant="outline-danger"
        size="sm"
        className="btn-remove"
        onClick={handleDelete}
        disabled={isPending}
      >
        {isPending ? 'Removing...' : 'Remove'}
      </Button>
      {errorMessage && (
        <Alert className="w-100" variant="danger">
          {errorMessage}
        </Alert>
      )}
    </>
  );
}
