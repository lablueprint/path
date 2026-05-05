import { createClient } from '@/app/lib/supabase/server-client';
import TicketItemsList from '@/app/(main)/components/TicketItemsList';
import SubmitTicketButton from '@/app/(main)/request/[storeId]/cart/components/SubmitTicketButton';
import Link from 'next/link';
import TicketDestStoreDropdown from '@/app/(main)/components/TicketDestStoreDropdown';
import { Store } from '@/app/types/store';

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
    return <div>User not found</div>;
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
      <div>
        <h1>Cart</h1>
        {showSuccess && (
          <div>
            <p>Ticket submitted successfully!</p>
            <Link href={`/outgoing-tickets/${ticketId}`}>Go to ticket</Link>
          </div>
        )}
        <div>No items found in cart.</div>
      </div>
    );
  }

  // Query for ticket items
  const { data: ticketItems, error: itemsError } = await supabase
    .from('ticket_items')
    .select('ticket_item_id')
    .eq('ticket_id', ticket.ticket_id);
  if (itemsError) {
    console.error('Error fetching ticket items:', itemsError);
    return <div>Failed to load cart items.</div>;
  }

  const hasItems = ticketItems && ticketItems.length > 0;

  // If ticket exists, query for dest store options
  const { data: destStoreOptions, error: destStoreOptionsError } = await supabase
    .from('stores')
    .select('store_id, name, street_address')
    .neq('store_id', storeId);
  if (destStoreOptionsError) {
    console.error('Error fetching destination store options:', destStoreOptionsError);
  }

  // If ticket exists, query for current dest store
  const { data: currentDestStore, error: currentDestStoreError } = await supabase
    .from('stores')
    .select('store_id, name, street_address')
    .eq('store_id', ticket.dest_store_id)
    .single();

  return (
    <div>
      <h1>Cart</h1>
      <div>
        <p>Ticket Destination Store: </p>
        <TicketDestStoreDropdown 
          ticketId={ticket.ticket_id}
          currentDestStore={ currentDestStore as Store || null }
          destStoreOptions={ (destStoreOptions ?? []).map((store) => ( { store })) }
        />
      </div>
      {showSuccess && (
        <div>
          <p>Ticket submitted successfully!</p>
          <Link href={`/outgoing-tickets/${ticketId}`}>Go to ticket</Link>
        </div>
      )}
      {hasItems ? (
        <>
          <TicketItemsList ticketId={ticket.ticket_id} />
          <SubmitTicketButton ticketId={ticket.ticket_id} />
        </>
      ) : (
        <div>No items found in cart.</div>
      )}
    </div>
  );
}