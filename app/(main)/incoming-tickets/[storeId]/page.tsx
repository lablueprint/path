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
  // Get user role from the authenticated user object (secure way)
  const userRole = user.app_metadata?.user_role || user.user_metadata?.user_role || (user as any).user_role;
  let canManage = false;

  // Check if user is superadmin or owner
  if (userRole === 'superadmin' || userRole === 'owner') {
    console.log('✓ User is superadmin or owner');
    canManage = true;
  } else {
    // Check if user is a store admin for this specific store
    console.log('Checking store_admins table...');
    const { data: storeAdmin, error: adminError } = await supabase
      .from('store_admins')
      .select('store_admin_id')
      .eq('user_id', user.id)
      .eq('store_id', storeId)
      .maybeSingle();

    if (adminError) {
      console.error('Error checking store admin status:', adminError);
      return notFound();
    }

    canManage = !!storeAdmin;
    console.log('canManage:', canManage);
  }

  // If user cannot manage the store, redirect to not found
  if (!canManage) {
    console.log('User cannot manage this store - redirecting to not found');
    return notFound();
  }
  console.log('User can manage this store');

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

  console.log('Store:', storeId);

  // Debug: Try different queries to see what RLS allows
  const { data: myTickets } = await supabase
    .from('tickets')
    .select('*')
    .eq('requestor_user_id', user.id);

  const { data: allTicketsNoFilter } = await supabase
    .from('tickets')
    .select('*');

  console.log('=== RLS PERMISSION DEBUG ===');
  console.log('User ID:', user.id);
  console.log('userRole from JWT:', userRole);
  console.log('Tickets where I am requestor:', myTickets?.length || 0);
  console.log('All tickets (no filter):', allTicketsNoFilter?.length || 0);
  console.log('============================');

  // Fetch all tickets from the tickets table where store_id matches the StoreId prop
  const { data: tickets, error: ticketsError } = await supabase
    .from('tickets')
    .select('*')
    .eq('store_id', storeId);

  // Debug: Check tickets query result
  console.log('=== TICKETS DEBUG ===');
  console.log('Tickets fetched:', tickets);
  console.log('Tickets count:', tickets?.length);
  console.log('Tickets error:', ticketsError);
  console.log('=====================');

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
      ></IncomingTicketsList>
      <IncomingTicketsList
        tickets={tickets}
        status="ready"
      ></IncomingTicketsList>
      <IncomingTicketsList
        tickets={tickets}
        status="rejected"
      ></IncomingTicketsList>
      <IncomingTicketsList
        tickets={tickets}
        status="fulfilled"
      ></IncomingTicketsList>
    </div>
  );

}