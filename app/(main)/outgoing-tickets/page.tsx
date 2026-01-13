import { createClient } from '@/app/lib/supabase/server-client';
import { Ticket } from '@/app/types/ticket';

export default async function OutgoingTicketsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: userTickets, error: err } = await supabase
    .from('tickets')
    .select('*');
  console.log(userTickets);
  if (err) {
    console.error('Error fetching tickets:', err);
    return <div>Failed to load data.</div>;
  }

  const url = 'http://localhost:3000/';

  return (
    <div>
      <h1>Tickets</h1>
      <h2>User: {user?.email ? user.email : 'Not Signed In'}</h2>
      <ul>
        {userTickets && userTickets.length > 0 ? (
          userTickets?.map((ticket) => (
            <li key={ticket.ticket_id}>{ticket.ticket_id}</li>
          ))
        ) : (
          <li>No tickets</li>
        )}
      </ul>
      <a href={url + 'test'}>
        <button>Test</button>
      </a>
    </div>
  );
}
