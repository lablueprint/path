import { createClient } from '@/app/lib/supabase/server-client';
import { notFound } from 'next/navigation';
import IncomingTicketsList from './components/IncomingTicketsList';

export default async function IncomingTicketsPage({
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
  const { data: canManage, error: canManageError } = await supabase
    .rpc('can_manage_store', { store_to_manage_id: storeId });

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
    console.error('Error fetching store: ', storeError);
    return notFound();
  }

  console.log(storeId);

  // Fetch all tickets from the tickets table where store_id matches the StoreId prop
  const { data: tickets, error: ticketsError } = await supabase
    .from('tickets')
    .select('*')
    .eq('store_id', storeId);

  console.log(tickets);

  if (ticketsError) {
    console.error('Error fetching tickets:', ticketsError);
    return <div>Failed to load tickets.</div>;
  }

  return (
    <div>
      <h1>Incoming Tickets</h1>
      <IncomingTicketsList
        tickets={tickets}
        status="requested"
        basePath={`/incoming-tickets/${storeId}`}
      ></IncomingTicketsList>
      <IncomingTicketsList
        tickets={tickets}
        status="ready"
        basePath={`/incoming-tickets/${storeId}`}
      ></IncomingTicketsList>
      <IncomingTicketsList
        tickets={tickets}
        status="rejected"
        basePath={`/incoming-tickets/${storeId}`}
      ></IncomingTicketsList>
      <IncomingTicketsList
        tickets={tickets}
        status="fulfilled"
        basePath={`/incoming-tickets/${storeId}`}
      ></IncomingTicketsList>
    </div>
  );
}