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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: userTicket, error: err } = await supabase
    .from('tickets')
    .select(`store_id, ticket_id, requestor_user_id, status, date_submitted,
      stores (
        name,
        street_address
      )
    `)
    .eq('ticket_id', ticketId)
    //REVISIT WHY THIS DOES NOT WORK - 
    //.eq('is_in_stock_request', true)
    .single();

  if (err) {
    console.error('Error fetching ticket:', err);
    return <div>Failed to load data.</div>;
  }

  let ticketItems: any[] = [];
  let OutOfStockTicketItems: { ticket_item_id: string; free_text_description: string | null }[] = [];
  if (userTicket) {
    const {data: items} = await supabase
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
      //.eq('is_in_stock_request', true); 
      ticketItems = items || [];


    const { data: outOfStock } = await supabase
      .from('ticket_items') 
      .select(`ticket_item_id,
        free_text_description
      `)
      .eq('ticket_id', ticketId)
      .eq('is_in_stock_request', false);
      OutOfStockTicketItems = outOfStock || [];

  }  

  return (
    <div>
      {userTicket ? (
        <div>
          <h1>Ticket - {userTicket.ticket_id}</h1>
          <h2>
            Your Email Address:{' '}
            {user?.email ? user.email : 'User not Found'}{' '}
          </h2>
          <h3>---Your Requestor ID: {userTicket.requestor_user_id}---</h3>
          <h2>Status: {userTicket.status}</h2>
          <h2>Date Submitted: {userTicket.date_submitted}</h2>
          <h2>Store ID: {userTicket.store_id}</h2>
          <h2>Store Name: {userTicket.stores?.[0]?.name} </h2>
          <h2>Store Address: {userTicket.stores?.[0]?.street_address}</h2>
          <div className='mt-8'>
            <h2 className="text-xl font-semibold mb-4"> In-stock Requests</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ticketItems.map((item) => (
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
        </div>
        <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Out-of-Stock Requests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {OutOfStockTicketItems.map((item) => (
                <OutOfStockTicketItemCard
                  key={item.ticket_item_id}
                  ticketItemId={item.ticket_item_id}
                  freeTextDescription={item.free_text_description || 'No description'}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <h1>Ticket Not Found</h1>
      )}
      <div className="ticket-list">
      <h2>Available Tickets</h2>
      {/* {tickets
        .filter(ticket => ticket.status === "in-stock")
        .map(ticket => (
          <InStockTicketItemCard 
            key={ticket.id} 
            ticketData={ticket} 
          />
        ))
      } */}
    </div>
      <a href="./">
        <button>--Back--</button>
      </a>
    </div>
  );
}
