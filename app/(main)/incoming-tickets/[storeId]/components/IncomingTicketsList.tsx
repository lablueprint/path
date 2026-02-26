import { Ticket } from '@/app/types/ticket';
import IncomingTicketCard from './IncomingTicketCard';
import Link from 'next/link';

type Status = 'requested' | 'ready' | 'rejected' | 'fulfilled';

type IncomingTicketsListProps = {
  tickets: {
    id: string;
    requestorFirstName: string;
    requestorLastName: string;
    status: string;
    date: string;
  }[];
  status: string;
};

export default function IncomingTicketsList({
  tickets,
  status,
}: IncomingTicketsListProps) {
  // Filter tickets to only show tickets with the given status
  const filteredTickets = tickets.filter((ticket) => ticket.status === status);

  return (
    <div>
      {/* Display heading that indicates the status */}
      <h2>{status.toUpperCase()} TICKETS</h2>

      {filteredTickets.length > 0 ? (
        <div>
          {/* Map the list of tickets to IncomingTicketCard components */}
          {filteredTickets.map((ticket) => (
            <IncomingTicketCard
              key={ticket.id}
              id={ticket.id}
              requestorFirstName={ticket.requestorFirstName}
              requestorLastName={ticket.requestorLastName}
              status={ticket.status}
              date={ticket.date}
            />
          ))}
        </div>
      ) : (
        <p>No tickets with status: {status}</p>
      )}
    </div>
  );
}
