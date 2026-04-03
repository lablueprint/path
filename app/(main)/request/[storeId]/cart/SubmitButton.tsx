'use client';
import { useState, useTransition } from 'react';
import { updateTicketStatus } from '@/app/actions/ticket';
import Link from 'next/link';

export default function SubmitButton({ ticketId }: { ticketId: string }) {
  const [success, setSuccess] = useState(false);
  const [outgoingTicketId, setOutgoingTicketId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    startTransition(async () => {
      const result = await updateTicketStatus(ticketId, 'requested');
      if (result?.success) {
        setSuccess(true);
        setOutgoingTicketId(ticketId);
      } else {
        setError(result?.error || 'Failed to submit ticket.');
      }
    });
  };

  if (success && outgoingTicketId) {
    return (
      <div>
        <p>Ticket submitted successfully!</p>
        <Link href={`/outgoing-tickets/${outgoingTicketId}`}>Go to ticket</Link>
      </div>
    );
  }

  return (
    <div>
      <button type="button" onClick={handleSubmit} disabled={isPending}>
        {isPending ? 'Submitting...' : 'Submit ticket'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
