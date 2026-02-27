import IncomingTicketCard from '@/app/(main)/incoming-tickets/[storeId]/components/IncomingTicketCard';

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
          <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Ticket ID</th>
                <th style={{ width: '20%' }}>Status</th>
                <th style={{ width: '30%' }}>Requestor</th>
                <th style={{ width: '20%' }}>Date Submitted</th>
              </tr>
            </thead>
            <tbody>
              {/* Map the list of tickets to IncomingTicketCard components */}     
                {filteredTickets.map((ticket) => (
                <IncomingTicketCard
                  key={ticket.id}
                  ticketId={ticket.id}
                  requestorFirstName={ticket.requestorFirstName}
                  requestorLastName={ticket.requestorLastName}
                  status={ticket.status}
                  date={ticket.date}
                />
              ))}
            </tbody>
          </table>
          
        </div>
      ) : (
        <p>No tickets with status: {status}</p>
      )}
    </div>
  );
}
