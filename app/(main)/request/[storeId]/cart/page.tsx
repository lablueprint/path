import { createClient } from '@/app/lib/supabase/server-client';
import TicketItemsList from '@/app/(main)/components/TicketItemsList';
import SubmitTicketButton from '@/app/(main)/request/components/SubmitTicketButton';
import TicketLogistics from '@/app/(main)/components/TicketLogistics';
import Image from 'next/image';
import pinIcon from '@/public/pin-icon.svg';
import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';
import Link from 'next/link';
import { Store } from '@/app/types/store';
import AddOutOfStockToCartForm from '@/app/(main)/request/components/AddOutOfStockToCartForm';
import { Alert } from 'react-bootstrap';

export default async function CartPage({
  params,
  searchParams,
}: {
  params: Promise<{ storeId: string }>;
  searchParams: Promise<{ submitted?: string; ticketId?: string }>;
}) {
  const { storeId } = await params;
  const { submitted, ticketId } = await searchParams;
  const showSuccess = submitted === '1' && !!ticketId;
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <Alert variant="danger">Failed to load user.</Alert>;
  }

  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('*')
    .eq('store_id', storeId)
    .single();

  if (storeError || !store) {
    return <Alert variant="danger">Failed to load store.</Alert>;
  }

  // Query for draft ticket
  const { data: ticket, error: ticketError } = await supabase
    .from('tickets')
    .select('*')
    .eq('store_id', storeId)
    .eq('requestor_user_id', user.id)
    .eq('status', 'draft')
    .single();

  if (ticketError || !ticket) {
    return (
      <>
        <Breadcrumbs
          labelMap={{
            request: 'Request Inventory',
            [`/request/${storeId}`]: store.name,
          }}
        />
        <h1>
          <span>Cart for </span>
          {store.name} <Image src={pinIcon} height={32} alt="Pin icon" />
        </h1>
        {showSuccess && (
          <>
            <p>Ticket submitted successfully!</p>
            <Link href={`/outgoing-tickets/${ticketId}`}>Go to Ticket</Link>
          </>
        )}
        <TicketItemsList ticketId={null} />
        <AddOutOfStockToCartForm storeId={storeId} />
      </>
    );
  }

  // Query for ticket items
  const { data: ticketItems, error: itemsError } = await supabase
    .from('ticket_items')
    .select('ticket_item_id')
    .eq('ticket_id', ticket.ticket_id);
  if (itemsError) {
    return <Alert variant="danger">Failed to load cart items.</Alert>;
  }

  const hasItems = ticketItems && ticketItems.length > 0;

  // If ticket exists, query for dest store options
  const { data: destStoreOptions, error: destStoreOptionsError } =
    await supabase
      .from('stores')
      .select('store_id, name, street_address')
      .neq('store_id', storeId);
  if (destStoreOptionsError) {
    return (
      <Alert variant="danger">Failed to load destination store options.</Alert>
    );
  }

  // If ticket exists, query for current dest store
  const { data: currentDestStore } = await supabase
    .from('stores')
    .select('store_id, name, street_address')
    .eq('store_id', ticket.dest_store_id)
    .single();

  return (
    <>
      <Breadcrumbs
        labelMap={{
          request: 'Request Inventory',
          [`/request/${storeId}`]: store.name,
        }}
      />
      <h1>
        <span>Cart for </span>
        {store.name} <Image src={pinIcon} height={32} alt="Pin icon" />
      </h1>
      {showSuccess && (
        <>
          <p>Ticket submitted successfully!</p>
          <Link href={`/outgoing-tickets/${ticketId}`}>Go to Ticket</Link>
        </>
      )}
      <TicketItemsList ticketId={ticket.ticket_id} />
      <AddOutOfStockToCartForm storeId={storeId} />
      {hasItems ? (
        <>
          <TicketLogistics
            ticketId={ticket.ticket_id}
            sourceStore={store}
            currentDestStore={(currentDestStore as Store) || null}
            destStoreOptions={(destStoreOptions ?? []).map((store) => ({
              store,
            }))}
          />
          <SubmitTicketButton ticketId={ticket.ticket_id} />
        </>
      ) : null}
    </>
  );
}
