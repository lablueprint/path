'use client';
import { useState, useTransition } from 'react';
import { updateTicketStatus } from '@/app/actions/ticket';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function SubmitTicketButton({ ticketId }: { ticketId: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSubmit = async () => {
    setError(null);
    setSuccessMessage('');
    startTransition(async () => {
      const result = await updateTicketStatus('requested', ticketId);
      if (result.success) {
        setSuccessMessage('Ticket submitted successfully!');
        const params = new URLSearchParams(searchParams?.toString() || '');
        params.set('submitted', '1');
        params.set('ticketId', ticketId);
        router.replace(`${pathname}?${params.toString()}`);
      } else {
        setError(result.error || 'Failed to submit ticket.');
      }
    });
  };

  return (
    <div>
      <button type="button" onClick={handleSubmit} disabled={isPending}>
        {isPending ? 'Submitting...' : 'Submit ticket'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
}
