import { Ticket } from '@/app/types/ticket';
import IncomingTicketCard from './IncomingTicketCard';
import Link from 'next/link';

type Status = 'requested' | 'ready' | 'rejected' | 'fulfilled';

interface IncomingTicketsListProps {
  tickets: Ticket[];
  status: Status;
}

export default function IncomingTicketsList({ tickets, status, basePath }: IncomingTicketsListProps) {
  // Filter tickets to only show tickets with the given status
  const filteredTickets = tickets.filter(
    (ticket) => ticket.status === status,
  );

  return (
    <div>
      {/* Display heading that indicates the status */}
      <h2>{status.toUpperCase()} TICKETS</h2>
      
      {filteredTickets.length > 0 ? (
        <div>
          {/* Map the list of tickets to IncomingTicketCard components */}
          {filteredTickets.map((ticket) => (
            <Link
              key={ticket.ticket_id} 
              href={`${basePath}/${ticket.ticket_id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <IncomingTicketCard ticket={ticket} />
            </Link>
          ))}
        </div>
      ) : (
        <p>No tickets with status: {status}</p>
      )}
    </div>
  );
}