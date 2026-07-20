'use client';
import { useState, useTransition } from 'react';
import { updateTicketStatus } from '@/app/actions/ticket';
import { Button } from 'react-bootstrap';

export default function SubmitTicketButton({ ticketId }: { ticketId: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const handleSubmit = async () => {
    setError(null);
    setSuccessMessage('');
    startTransition(async () => {
      const result = await updateTicketStatus('requested', ticketId);
      if (result.success) {
        setSuccessMessage('Ticket submitted successfully.');
      } else setError(result.error || 'Failed to submit ticket.');
    });
  };

  return (
    <>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <Button
        type="button"
        className="btn-submit align-self-start"
        onClick={handleSubmit}
        disabled={isPending}
      >
        {isPending ? 'Submitting...' : 'Submit Ticket'}
      </Button>
    </>
  );
}
