import { createClient } from '@/app/lib/supabase/server-client';
import InStockTicketItemCard from '@/app/components/InStockTicketItemCard';

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

  let ticketItems = [];
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
