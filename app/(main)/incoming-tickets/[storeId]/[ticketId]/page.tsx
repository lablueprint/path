import TicketDetails from '../../../components/TicketDetails';

export default async function IncomingTicketDetailsPage({
    params,
}: {
    params: Promise<{ ticketId: string }>;
}) {
    const { ticketId } = await params;

    return (
        <TicketDetails ticketId={ticketId} outgoing={false}></TicketDetails>
    );
}
