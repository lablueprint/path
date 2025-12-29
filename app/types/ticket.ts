export type Ticket = {
  ticket_id: string; // string corresponds to uuid
  requestor_user_id: string;
  store_id: string;
  status: string; // string corresponds to varchar
  date_submitted: Date | string; // Date | string corresponds to time stamp with time zone
};

export type TicketUpdate = Partial<Ticket>;

export type TicketInsert = Omit<Ticket, 'ticket_id' | 'date_submitted'>;

export type TicketItem = {
  ticket_item_id: string;
  ticket_id: string;
  store_item_id?: string | null;
  free_text_description?: string | null;
  quantity_requested?: number | null;
  is_in_stock_request: boolean;
};

export type TicketItemUpdate = Partial<TicketItem>;

export type TicketItemInsert = Omit<TicketItem, 'ticket_item_id'>;
