'use client';

import {
  createTicketItem,
  updateTicketItemDescription,
  updateTicketItemQuantity,
  deleteTicketItem,
} from '@/app/actions/ticket';
import { TicketItemInsert } from '@/app/types/ticket';

export default function TicketItemTestComponent() {
  const data: TicketItemInsert = {
    ticket_id: 'c088b0b7-e4c3-40ae-80ca-9d8376dbb4fa',
    store_item_id: 'bec1fdd9-d6f0-4c49-aa2f-c67a18fc05f2',
    free_text_description: 'sample description',
    quantity_requested: 10,
    is_in_stock_request: true,
  };

  const ticketItemId = '4a3e0f98-e17a-4891-9d7c-d72f44245adc';

  const handleCreate = async () => {
    await createTicketItem(data);
  };

  const handleDelete = async () => {
    await deleteTicketItem(ticketItemId);
  };

  const handleChangeDescription = async () => {
    await updateTicketItemDescription(ticketItemId, 'new description');
  };

  const handleChangeQuantity = async () => {
    await updateTicketItemQuantity(ticketItemId, 5);
  };

  return (
    <div>
      <button onClick={handleCreate}>Click to add ticket item</button>
      <button onClick={handleDelete}>Click to delete ticket item</button>
      <button onClick={handleChangeDescription}>
        Click to modify description
      </button>
      <button onClick={handleChangeQuantity}>Click to modify quantity</button>
    </div>
  );
}
