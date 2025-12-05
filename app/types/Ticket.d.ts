export type Ticket = {
  ticket_id: string; // string corresponds to uuid
  requestor_user_id: string;
  store_id: string;
  status: string; // string corresponds to varchar
  date_submitted: Date | string; // Date | string corresponds to time stamp with time zone
};

export type TicketUpdate = Partial<Ticket>;
