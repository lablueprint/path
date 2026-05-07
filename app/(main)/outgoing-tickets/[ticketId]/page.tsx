import TicketDetails from '@/app/(main)/components/TicketDetails';
import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';

export default async function OutgoingTicketDetailsPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;

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
