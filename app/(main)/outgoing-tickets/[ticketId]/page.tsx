import TicketDetails from '@/app/(main)/components/TicketDetails';
// 1. Import the Breadcrumbs component
import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';

export default async function OutgoingTicketDetailsPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;

  return (
    <div>
      {/* 2. Add Breadcrumbs with hyphenated static labels */}
      <Breadcrumbs
        labelMap={{
          'outgoing-tickets': 'Outgoing-Tickets',
          [ticketId]: ticketId, // Keeping the ID as is per your request
        }}
      />

      <TicketDetails ticketId={ticketId} outgoing={true} />
    </div>
  );
}
