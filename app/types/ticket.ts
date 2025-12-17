export type TicketItem = {
  ticket_item_id: string;
  ticket_id: string;
  inventory_item_id?: string | null;
  free_text_description?: string | null;
  quantity_requested?: number | null;
  is_in_stock_request: boolean;
};

export type TicketItemUpdate = Partial<TicketItem>;

export type TicketItemInsert = Omit<TicketItem, 'ticket_item_id'>;
