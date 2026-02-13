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

  // Also check if they can manage the store
  const { data: canManage, error: permissionError } = await supabase.rpc(
    'can_manage_store',
    { store_to_manage_id: storeId },
  );

  if (permissionError) {
    console.error('User does not have permission to access this store: ', permissionError);
    return notFound();
  }

  if (!canManage) {
    notFound();
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

  // Fetch all tickets from the tickets table where store_id matches the StoreId prop
  const { data: tickets, error: ticketsError } = await supabase
  .from('tickets')
  .select('*')
  .eq('store_id', storeId);

  if (ticketsError) {
    console.error('Error fetching tickets:', ticketsError);
    return <div>Failed to load tickets.</div>;
  }

  return (
    <div>
      <h1>Incoming Tickets</h1>
      {/* Display store name and address */}
      <div>
        <h2>{store.name}</h2>
        <p>{store.street_address}</p>
      </div>
      
      {/* Display tickets for each status */}
      <IncomingTicketsList 
        tickets={tickets || []} 
        status="requested" 
      />
      <IncomingTicketsList 
        tickets={tickets || []} 
        status="ready" 
      />
      <IncomingTicketsList 
        tickets={tickets || []} 
        status="rejected" 
      />
      <IncomingTicketsList 
        tickets={tickets || []} 
        status="fulfilled" 
      />
    </div>
  );
  
}