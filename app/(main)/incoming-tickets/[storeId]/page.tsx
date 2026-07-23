import { createClient } from '@/app/lib/supabase/server-client';
import { Alert } from 'react-bootstrap';
import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';
import IncomingTicketsList from '@/app/(main)/incoming-tickets/[storeId]/components/IncomingTicketsList';

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
    return <Alert variant="danger">Failed to load user.</Alert>;
  }

  // Check if user can manage the store
  const { data: canManage, error: canManageError } = await supabase.rpc(
    'can_manage_store',
    { store_to_manage_id: storeId },
  );

  if (canManageError || !canManage) {
    return <Alert variant="danger">Failed to load store.</Alert>;
  }

  // Fetch the store's entry in the stores table
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('*')
    .eq('store_id', storeId)
    .single();

  if (storeError || !store) {
    return <Alert variant="danger">Failed to load store.</Alert>;
  }

  // Fetch all tickets from the tickets table where store_id matches the storeId prop
  const { data: ticketsData, error: ticketsError } = await supabase
    .from('tickets')
    .select('*, users(*)')
    .eq('store_id', storeId)
    .in('status', ['requested', 'approved', 'ready', 'rejected', 'fulfilled']);

  if (ticketsError) {
    return <Alert variant="danger">Failed to load tickets.</Alert>;
  }

  const tickets =
    ticketsData?.map((ticket) => ({
      id: ticket.ticket_id as string,
      requestorFirstName: ticket.users.first_name as string,
      requestorLastName: ticket.users.last_name as string,
      status: ticket.status as string,
      date: ticket.date_submitted as string,
    })) ?? [];

  return (
    <>
      <Breadcrumbs
        labelMap={{
          'incoming-tickets': 'Store Tickets',
          [storeId]: store.name,
        }}
      />
      <h1>Store Tickets</h1>
      <IncomingTicketsList tickets={tickets} />
    </>
  );
}
