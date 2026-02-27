import OutgoingTicketCard from './OutgoingTicketCard';
import { createClient } from '@/app/lib/supabase/server-client';

type Status = 'requested' | 'ready' | 'rejected' | 'fulfilled';

export default async function OutgoingTicketsList({ status }: { status: Status }) {

  const supabase = await createClient();

  const { data, error } = await supabase
  .from('tickets')
  .select(`
    ticket_id,
    status,
    date_submitted,
    store_id,
    stores (
      name
    )
  `);

  if (error) return <p>Error loading tickets.</p>;

  const filteredTickets = data.filter((ticket) => ticket.status === status);

  return (
    <div>
      <h2>{status.toUpperCase()} TICKETS</h2>
      {filteredTickets.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Store Name</th>
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