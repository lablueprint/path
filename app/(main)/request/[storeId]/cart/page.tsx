import { createClient } from '@/app/lib/supabase/server-client';
import TicketItemsList from '@/app/(main)/components/TicketItemsList';
import SubmitButton from './SubmitButton';

export default async function CartPage({
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
    return <div>No items found in cart.</div>;
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

  return (
    <div>
      <h1>Cart</h1>
      {hasItems ? (
        <>
          <TicketItemsList ticketId={ticket.ticket_id} />
          <SubmitButton ticketId={ticket.ticket_id} />
        </>
      ) : (
        <div>No items found in cart.</div>
      )}
    </div>
  );
}
