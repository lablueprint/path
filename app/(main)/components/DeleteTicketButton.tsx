'use client';

import { deleteTicket } from '@/app/actions/ticket';
import { usePathname, useRouter } from 'next/navigation';

export default function DeleteTicketButton({
  ticketId,
}: {
  ticketId: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleDelete() {
    const result = await deleteTicket(ticketId);

    if (!result.success) {
      console.error('Failed to delete ticket:', result.error);
      return;
    }

    const parentPath = pathname.split('/').slice(0, -1).join('/') || '/';
    router.push(parentPath);
  }

  return (
    <button type="button" onClick={handleDelete}>
      Delete ticket
    </button>
  );
}
