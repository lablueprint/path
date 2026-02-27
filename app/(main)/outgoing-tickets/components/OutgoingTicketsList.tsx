import OutgoingTicketCard from './OutgoingTicketCard';

type Status = 'requested' | 'ready' | 'rejected' | 'fulfilled';

type Ticket = {
  ticket_id: string;
  status: string;
  date_submitted: string;
  store_id: string;
  stores: { name: string }[] | null;
};

export default async function OutgoingTicketsList({ tickets, status }: { tickets: Ticket[], status: Status }) {

  const filteredTickets = tickets.filter((ticket) => ticket.status === status);

  return (
    <div>
      <h2>{status.toUpperCase()} TICKETS</h2>
      {filteredTickets.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Store</th>
              <th>Status</th>
              <th>Date Submitted</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) =>
              <OutgoingTicketCard
                key={ticket.ticket_id}
                ticketId={ticket.ticket_id}
                date={ticket.date_submitted}
                status={ticket.status}
                storeName={(ticket.stores as unknown as { name: string } | null)?.name}
              />
            )}
          </tbody>
        </table>
      ) : (
        <p>No ticket with status: {status}</p>
      )}
    </div>
  );
}