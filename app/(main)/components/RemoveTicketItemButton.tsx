'use client';

import { deleteTicketItem } from '@/app/actions/ticket';
import { useState, useTransition } from 'react';

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
      <button type="button" onClick={handleDelete} disabled={isPending}>
        {isPending ? 'Removing...' : 'Remove'}
      </button>
      {errorMessage && (
        <p role="alert" style={{ color: 'red' }}>
          {errorMessage}
        </p>
      )}
    </>
  );
}
