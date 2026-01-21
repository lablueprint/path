import { createClient } from '@/app/lib/supabase/server-client';
import { Ticket } from '@/app/types/ticket';
import OutgoingTicketsList from './components/OutgoingTicketsList';

export default async function OutgoingTicketsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: userTickets, error: err } = await supabase
    .from('tickets')
    .select('*')
    .eq('requestor_user_id', user?.id);

  if (err) {
    console.error('Error fetching tickets:', err);
    return <div>Failed to load data.</div>;
  }

  return (
    <div>
      <h1>Outgoing Tickets</h1>
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
    </div>
  );
}
