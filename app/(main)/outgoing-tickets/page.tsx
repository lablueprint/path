import { createClient } from '@/app/lib/supabase/server-client';
import { Ticket } from '@/app/types/ticket';
import OutgoingTicketsList from './components/OutgoingTicketList';

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
      <h1>Outgoing Tickets</h1>
      <h2>User: {user?.email ? user.email : 'Not Signed In'}</h2>
      <OutgoingTicketsList
        tickets={userTickets}
        status="requested"
      ></OutgoingTicketsList>
      <OutgoingTicketsList
        tickets={userTickets}
        status="ready"
      ></OutgoingTicketsList>
      <OutgoingTicketsList
        tickets={userTickets}
        status="rejected"
      ></OutgoingTicketsList>
      <OutgoingTicketsList
        tickets={userTickets}
        status="fulfilled"
      ></OutgoingTicketsList>
      <br></br>
      <a href={url + 'test'}>
        <button>--Testing Page--</button>
      </a>
    </div>
  );
}
