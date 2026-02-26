import { createClient } from '@/app/lib/supabase/server-client';
import { notFound } from 'next/navigation';
import IncomingTicketsList from './components/IncomingTicketsList';

export default async function IncomingTicketsStorePage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }

  // Check if user can manage the store
  const { data: canManage, error: canManageError } = await supabase.rpc(
    'can_manage_store',
    { store_to_manage_id: storeId },
  );

  if (canManageError) {
    console.error('Error checking store access:', canManageError);
    return notFound();
  }

  if (!canManage) {
    return notFound();
  }

  // Fetch the store's entry in the stores table
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('*')
    .eq('store_id', storeId)
    .single();

  if (storeError || !store) {
    console.error('Error fetching store:', storeError);
    return notFound();
  }

  // Fetch all tickets from the tickets table where store_id matches the storeId prop
  const { data: ticketsData, error: ticketsError } = await supabase
    .from('tickets')
    .select('*, users(*)')
    .eq('store_id', storeId);

  if (ticketsError) {
    console.error('Error fetching tickets:', ticketsError);
    return <div>Failed to load tickets.</div>;
  }

  const tickets = ticketsData?.map((ticket) => ({
    id: ticket.ticket_id as string,
    requestorFirstName: ticket.users.first_name as string,
    requestorLastName: ticket.users.last_name as string,
    status: ticket.status as string,
    date: ticket.date_submitted as string,
  }));

  return (
    <div>
      <h1>Incoming Tickets</h1>
      <IncomingTicketsList tickets={tickets} status="requested" />
      <IncomingTicketsList tickets={tickets} status="ready" />
      <IncomingTicketsList tickets={tickets} status="rejected" />
      <IncomingTicketsList tickets={tickets} status="fulfilled" />
    </div>
  );
}
