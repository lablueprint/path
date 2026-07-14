'use client';

import { deleteTicketItem } from '@/app/actions/ticket';
import { Button } from 'react-bootstrap';

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
    <Button
      variant="outline-danger"
      size="sm"
      className="btn-remove"
      onClick={handleDelete}
    >
      Remove
    </Button>
  );
}
