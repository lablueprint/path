import TicketDetails from '@/app/(main)/components/TicketDetails';
import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';
import { createClient } from '@/app/lib/supabase/server-client';
import { notFound } from 'next/navigation';

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
    return notFound();
  }

  const { data: ticket, error } = await supabase
    .from('tickets')
    .select('requestor_user_id')
    .eq('ticket_id', ticketId)
    .single();

  if (error || !ticket || ticket.requestor_user_id !== user.id) {
    return notFound();
  }

  return (
    <div>
      <Breadcrumbs
        labelMap={{
          'outgoing-tickets': 'Outgoing Tickets',
          [`/outgoing-tickets/${ticketId}`]: ticketId,
        }}
      />

      <TicketDetails ticketId={ticketId} outgoing={true} />
    </div>
  );
}
