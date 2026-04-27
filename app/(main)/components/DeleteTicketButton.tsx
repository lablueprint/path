'use client';

import { deleteTicket } from '@/app/actions/ticket';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteTicketButton({ ticketId }: { ticketId: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  async function handleDelete() {
    setErrorMessage('');
    setSuccessMessage('');
    const result = await deleteTicket(ticketId);

    if (!result.success) {
      setErrorMessage('Failed to delete ticket.' + result.error);
      return;
    }

    setSuccessMessage('Ticket deleted successfully!');
    const parentPath = pathname.split('/').slice(0, -1).join('/') || '/';
    router.push(parentPath);
  }

  return (
    <>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
      <button type="button" onClick={handleDelete}>
        Delete ticket
      </button>
    </>
  );
}
