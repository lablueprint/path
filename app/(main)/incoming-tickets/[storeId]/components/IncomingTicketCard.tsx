import { createClient } from '@/app/lib/supabase/server-client';
import { Ticket } from '@/app/types/ticket';

interface IncomingTicketCardProps {
  ticket: Ticket;
}

export default async function IncomingTicketCard({ ticket }: IncomingTicketCardProps) {
  const supabase = await createClient();

  // Fetch the ticket requestor's name from the users table
  const { data: requestor, error } = await supabase
    .from('users')
    .select('first_name, last_name')
    .eq('user_id', ticket.requestor_user_id)
    .single();

  if (error) {
    console.error('Error fetching requestor:', error);
    return <div>Error loading requestor information</div>;
  }

  // Display requestor's name, status, and date submitted
  return (
    <div style={{ border: '1px solid white', padding: '16px', margin: '8px' }}>
      <h3>Ticket #{ticket.ticket_id}</h3>
      <p><strong>Requestor:</strong> {requestor?.first_name} {requestor?.last_name}</p>
      <p><strong>Status:</strong> {ticket.status}</p>
      <p><strong>Date Submitted:</strong> {new Date(ticket.date_submitted).toLocaleDateString()}</p>
    </div>
  );
}