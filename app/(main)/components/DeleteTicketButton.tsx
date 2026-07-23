'use client';

import { deleteTicket } from '@/app/actions/ticket';
import { usePathname, useRouter } from 'next/navigation';
import { Button, Alert } from 'react-bootstrap';
import { useState, useTransition } from 'react';

export default function DeleteTicketButton({ ticketId }: { ticketId: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    setErrorMessage('');
    startTransition(async () => {
      const result = await deleteTicket(ticketId);

      if (!result.success) {
        setErrorMessage('Failed to remove ticket.');
        return;
      }

      const parentPath = pathname.split('/').slice(0, -1).join('/') || '/';
      router.push(parentPath);
    });
  }

  return (
    <>
      <Button
        variant="outline-danger"
        className="btn-remove btn-sm align-self-start align-self-md-end"
        onClick={handleDelete}
        disabled={isPending}
      >
        {isPending ? 'Removing...' : 'Remove'}
      </Button>
      {errorMessage && (
        <Alert
          variant="danger"
          className="align-self-start align-self-md-end w-100"
        >
          {errorMessage}
        </Alert>
      )}
    </>
  );
}
