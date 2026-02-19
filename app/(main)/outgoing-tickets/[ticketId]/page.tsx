import { createClient } from '@/app/lib/supabase/server-client';
import InStockTicketItemCard from '@/app/components/InStockTicketItemCard';
import OutOfStockTicketItemCard from '@/app/components/OutOfStockTicketItemCard';

export default async function ticketIdPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;

  const supabase = await createClient();

  const { data: userTicket, error: err } = await supabase
    .from('tickets')
    .select(`store_id, ticket_id, requestor_user_id, status, date_submitted,
      stores (
        name,
        street_address
      )
    `)
    .eq('ticket_id', ticketId)
    .single();

  if (err) {
    console.error('Error fetching ticket:', err);
    return <div>Failed to load data.</div>;
  }

  let InStockTicketItems: any[] = [];
  let OutOfStockTicketItems: { ticket_item_id: string; free_text_description: string | null }[] = [];
  if (userTicket) {
    const { data: items } = await supabase
      .from('ticket_items')
      .select(`*,
        store_items(
          quantity_available,
          inventory_items(
            name,
            photo_url,
            subcategories(
              name,
              categories(
                name
              )
            )
          )
        )
      `)
      .eq('ticket_id', ticketId)
      .eq('is_in_stock_request', true);
    InStockTicketItems = items || [];

    const { data: outOfStock } = await supabase
      .from('ticket_items')
      .select(`ticket_item_id,
        free_text_description
      `)
      .eq('ticket_id', ticketId)
      .eq('is_in_stock_request', false);
    OutOfStockTicketItems = outOfStock || [];
  }

  const store = userTicket.stores as unknown as { name: string, street_address: string };

  return (
    <div>
      {userTicket ? (
        <div>
          <h1>Outgoing Ticket Details</h1>
          <h2>Ticket: {userTicket.ticket_id}</h2>
          <h2>Date Submitted: {userTicket.date_submitted}</h2>
          <h2>Status: {userTicket.status}</h2>
          <h2>Store: {store.name} </h2>
          <h2>Store Address: {store.street_address}</h2>
          {InStockTicketItems.length > 0 ?
            <div>
              <h2> In-Stock Requests</h2>
              <div>
                {InStockTicketItems.map((item) => (
                  <InStockTicketItemCard
                    key={item.ticket_item_id}
                    ticketItemId={item.ticket_item_id}
                    quantityRequested={item.quantity_requested}
                    quantityAvailable={item.store_items?.quantity_available || 0}
                    itemName={item.store_items?.inventory_items?.name || 'Unknown'}
                    photoUrl={item.store_items?.inventory_items?.photo_url || ''}
                    subcategoryName={item.store_items?.inventory_items?.subcategories?.name || 'Unknown'}
                    categoryName={item.store_items?.inventory_items?.subcategories?.categories?.name || 'Unknown'}
                  />
                ))}
              </div>
            </div> : null}
          {OutOfStockTicketItems.length > 0 ?
            <div>
              <h2>Out-of-Stock Requests</h2>
              <div>
                {OutOfStockTicketItems.map((item) => (
                  <OutOfStockTicketItemCard
                    key={item.ticket_item_id}
                    ticketItemId={item.ticket_item_id}
                    freeTextDescription={item.free_text_description || 'No description'}
                  />
                ))}
              </div>
            </div> : null}
        </div>
      ) : (
        <p>No ticket found.</p>
      )}
    </div>
  );
}
