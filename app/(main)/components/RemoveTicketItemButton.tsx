'use client';

import { deleteTicketItem } from '@/app/actions/ticket';

type RemoveTicketItemButtonProps = {
  ticketItemId: string;
};

export default function RemoveTicketItemButton({
  ticketItemId,
}: RemoveTicketItemButtonProps) {
  const handleDelete = async () => {
    const { success, error } = await deleteTicketItem(ticketItemId);
    if (!success) {
      alert('Failed to remove ticket item.');
      console.error(error);
    }
  };

  return (
    <button type="button" onClick={handleDelete}>
      Remove
    </button>
  );
}
