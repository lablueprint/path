import { createClient } from '@/app/lib/supabase/server-client';
import OutgoingTicketsList from '@/app/(main)/outgoing-tickets/components/OutgoingTicketsList';
import { Alert } from 'react-bootstrap';

export default async function OutgoingTicketsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch store information along with tickets in the same Supabase query
  const { data: userTickets, error } = await supabase
    .from('tickets')
    .select(
      `
        ticket_id,
        status,
        date_submitted,
        store_id,
        stores!fk_stores (
          name
        )
      `,
    )
    .eq('requestor_user_id', user?.id);

  if (error) {
    return <Alert variant="danger">Failed to load tickets.</Alert>;
  }

  return (
    <>
      <h1>My Tickets</h1>
      <OutgoingTicketsList tickets={userTickets}></OutgoingTicketsList>
    </>
  );
}
