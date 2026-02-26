import TicketDetails from '@/app/(main)/components/TicketDetails';

export default async function IncomingTicketDetailsPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;

  return <TicketDetails ticketId={ticketId} outgoing={false} />;
}
