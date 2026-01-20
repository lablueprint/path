import { Ticket } from '@/app/types/ticket';

type Status = 'requested' | 'ready' | 'rejected' | 'fulfilled';

interface TicketListProps {
  tickets: Ticket[];
  status: Status;
}

export default function OutgoingTicketsList(props: TicketListProps) {
  const filteredTickets = props.tickets.filter(
    (ticket) => ticket.status === props.status,
  );

  const url = './outgoing-tickets/';

  return (
    <div>
      <h2>{props.status.toUpperCase()} TICKETS</h2>
      {filteredTickets.length > 0 ? (
        <table style={{ border: '1px solid white' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid white' }}>Ticket</th>
              <th style={{ border: '1px solid white' }}>Store ID</th>
              <th style={{ border: '1px solid white' }}>Status</th>
              <th style={{ border: '1px solid white' }}>Date Submitted</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr key={ticket.ticket_id}>
                <td style={{ border: '1px solid white' }}>
                  <a href={`${url}${ticket.ticket_id}`}>
                    <button>View</button>
                  </a>
                </td>
                <td style={{ border: '1px solid white' }}>{ticket.store_id}</td>
                <td style={{ border: '1px solid white' }}>{ticket.status}</td>
                <td style={{ border: '1px solid white' }}>
                  {ticket.date_submitted.toString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No ticket with status: {props.status}</p>
      )}
    </div>
  );
}
