import { Ticket } from '@/app/types/ticket';
import Link from 'next/link';

type Status = 'requested' | 'ready' | 'rejected' | 'fulfilled';

interface outgoingTicketsListProps {
  tickets: Ticket[];
  status: Status;
}

export default function OutgoingTicketsList(props: outgoingTicketsListProps) {
  const filteredTickets = props.tickets.filter(
    (ticket) => ticket.status === props.status,
  );

  return (
    <div>
      <h2>{props.status.toUpperCase()} TICKETS</h2>
      {filteredTickets.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Store ID</th>
              <th>Status</th>
              <th>Date Submitted</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr key={ticket.ticket_id}>
                <td>
                  <Link href={`/outgoing-tickets/${ticket.ticket_id}`}>
                    View
                  </Link>
                </td>
                <td>{ticket.store_id}</td>
                <td>{ticket.status}</td>
                <td>{ticket.date_submitted.toString()}</td>
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
