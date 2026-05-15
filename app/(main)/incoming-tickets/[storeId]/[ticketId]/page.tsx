import { createClient } from '@/app/lib/supabase/server-client';
import { notFound } from 'next/navigation';
import TicketDetails from '@/app/(main)/components/TicketDetails';
import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';

export default async function IncomingTicketDetailsPage({
  params,
}: {
  params: Promise<{ storeId: string; ticketId: string }>;
}) {
  const { storeId, ticketId } = await params;
  const supabase = await createClient();

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

  if (canManageError || !canManage) {
    if (canManageError) {
      console.error('Error checking store access:', canManageError);
    }
    return notFound();
  }

  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('name')
    .eq('store_id', storeId)
    .single();

  if (storeError) {
    console.error('Error fetching store for breadcrumbs:', storeError);
  }

  return (
    <div>
      <Breadcrumbs
        labelMap={{
          '/incoming-tickets': 'Incoming Tickets',
          [`/incoming-tickets/${storeId}`]: store?.name ?? 'Store',
          [`/incoming-tickets/${storeId}/${ticketId}`]: ticketId,
        }}
      />

      <TicketDetails ticketId={ticketId} outgoing={false} />
    </div>
  );
}
