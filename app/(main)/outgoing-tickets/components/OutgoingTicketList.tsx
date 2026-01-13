import { Ticket } from '@/app/types/ticket';

type Status = 'requested' | 'ready' | 'rejected' | 'fulfilled';

interface TicketListProps {
  tickets: Ticket[];
  status: Status;
}

export default async function OutgoingTicketsList(props: TicketListProps) {
  const filteredTickets = props.tickets.filter(
    (ticket) => ticket.status === props.status,
  );

  <div>
    <h2>{props.status}</h2>
    <table>
        
      {filteredTickets.map((ticket) => (
        <tr key={ticket.ticket_id}>
          <td>{ticket.store_id}</td>
          <td>{ticket.status}</td>
          <td>{ticket.date_submitted.toString()}</td>
        </tr>
      ))}
    </table>
  </div>;
}
