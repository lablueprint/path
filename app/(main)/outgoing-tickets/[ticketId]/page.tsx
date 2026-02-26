import TicketDetails from '@/app/(main)/components/TicketDetails';

export default async function OutgoingTicketDetailsPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;

  return <TicketDetails ticketId={ticketId} outgoing={true} />;
}
