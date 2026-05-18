'use client';
import { useState, useTransition } from 'react';
import { updateTicketStatus } from '@/app/actions/ticket';

export default function SubmitTicketButton({ ticketId }: { ticketId: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async () => {
    setError(null);
    startTransition(async () => {
      const result = await updateTicketStatus('requested', ticketId);
      if (!result.success) setError(result.error || 'Failed to submit ticket.');
    });
  };

  return (
    <div>
      <button type="button" onClick={handleSubmit} disabled={isPending}>
        {isPending ? 'Submitting...' : 'Submit ticket'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
