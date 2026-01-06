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
    ticket_id: '1d76da91-2d16-4252-8832-9b28ed1fa6fa',
    store_item_id: 'bec1fdd9-d6f0-4c49-aa2f-c67a18fc05f2',
    free_text_description: 'sample description',
    quantity_requested: 10,
    is_in_stock_request: true,
  };

  const ticketItemId = '874841cc-852e-4f00-8488-cf603ae2543b';

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
    await updateTicketItemQuantity(ticketItemId, 10);
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
