import { createClient } from '@/app/lib/supabase/server-client';
import { Alert } from 'react-bootstrap';
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

  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('name')
    .eq('store_id', storeId)
    .single();

  if (storeError) {
    return <Alert variant="danger">Failed to load store.</Alert>;
  }

  return (
    <>
      <Breadcrumbs
        labelMap={{
          '/incoming-tickets': 'Store Tickets',
          [`/incoming-tickets/${storeId}`]: store?.name ?? 'Store',
          [`/incoming-tickets/${storeId}/${ticketId}`]: ticketId,
        }}
      />
      <TicketDetails ticketId={ticketId} outgoing={false} />
    </>
  );
}
