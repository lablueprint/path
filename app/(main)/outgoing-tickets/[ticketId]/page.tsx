import TicketDetails from '@/app/(main)/components/TicketDetails';
import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';
import { createClient } from '@/app/lib/supabase/server-client';
import { Alert } from 'react-bootstrap';

export default async function OutgoingTicketDetailsPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <Alert variant="danger">Failed to load user.</Alert>;
  }

  const { data: ticket, error } = await supabase
    .from('tickets')
    .select('requestor_user_id')
    .eq('ticket_id', ticketId)
    .single();

  if (error || !ticket || ticket.requestor_user_id !== user.id) {
    return <Alert variant="danger">Failed to load ticket.</Alert>;
  }

  return (
    <>
      <Breadcrumbs
        labelMap={{
          'outgoing-tickets': 'My Tickets',
          [`/outgoing-tickets/${ticketId}`]: ticketId,
        }}
      />
      <TicketDetails ticketId={ticketId} outgoing={true} />
    </>
  );
}
