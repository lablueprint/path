import { createClient } from '@/app/lib/supabase/server-client';
import TicketDetails from '@/app/(main)/components/TicketDetails';
import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';

export default async function IncomingTicketDetailsPage({
  params,
}: {
  params: Promise<{ storeId: string; ticketId: string }>;
}) {
  const { storeId, ticketId } = await params;
  const supabase = await createClient();

  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('name')
    .eq('store_id', storeId)
    .single();

  if (storeError) {
    console.error('Error fetching store for breadcrumbs:', storeError);
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
