'use client';
import { useState, useTransition } from 'react';
import { updateTicketStatus } from '@/app/actions/ticket';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function SubmitButton({ ticketId }: { ticketId: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSubmit = async () => {
    setError(null);
    startTransition(async () => {
      const result = await updateTicketStatus('requested', ticketId);
      if (result?.success) {
        const params = new URLSearchParams(searchParams?.toString() || '');
        params.set('submitted', '1');
        params.set('ticketId', ticketId);
        router.replace(`${pathname}?${params.toString()}`);
      } else {
        setError(result?.error || 'Failed to submit ticket.');
      }
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
