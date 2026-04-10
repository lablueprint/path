import { createClient } from '@/app/lib/supabase/server-client';
import OutOfStockTicketItemCard from '@/app/(main)/components/OutOfStockTicketItemCard';
import InStockTicketItemCard from '@/app/(main)/components/InStockTicketItemCard';
import DeleteTicketButton from '@/app/(main)/components/DeleteTicketButton';
import UserCard from '@/app/(main)/components/UserCard';
import { User } from '@/app/types/user';

export default async function TicketDetails({
  ticketId,
  outgoing,
}: {
  ticketId: string;
  outgoing: boolean;
}) {
  const supabase = await createClient();

  const { data: userTicket, error: err } = await supabase
    .from('tickets')
    .select(
      `
        store_id, ticket_id, requestor_user_id, status, date_submitted,
        stores (
          name,
          street_address
        )
      `,
    )
    .eq('ticket_id', ticketId)
    .single();

  if (err) {
    console.error('Error fetching ticket:', err);
    return <div>Failed to load data.</div>;
  }

  let InStockTicketItems = [];
  let OutOfStockTicketItems: {
    ticket_item_id: string;
    free_text_description: string | null;
  }[] = [];
  if (userTicket) {
    const { data: inStockItemsData } = await supabase
      .from('ticket_items')
      .select(
        `
          *,
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
        `,
      )
      .eq('ticket_id', ticketId)
      .eq('is_in_stock_request', true);
    InStockTicketItems = inStockItemsData || [];

    const { data: outOfStockItemsData } = await supabase
      .from('ticket_items')
      .select(
        `
          ticket_item_id,
          free_text_description
        `,
      )
      .eq('ticket_id', ticketId)
      .eq('is_in_stock_request', false);
    OutOfStockTicketItems = outOfStockItemsData || [];
  }

  const store = userTicket.stores as unknown as {
    name: string;
    street_address: string;
  };

  let storeAdminsList: User[] = [];
  let requestor = null;
  if (outgoing) {
    const { data: storeAdminsData } = await supabase
      .from('store_admins')
      .select(
        `
          users(
            user_id,
            first_name,
            last_name,
            email,
            profile_photo_url
          )
        `,
      )
      .eq('store_id', userTicket.store_id);
    storeAdminsList = (storeAdminsData || [])
      .map((storeAdmin) => storeAdmin.users as unknown as User)
      .filter(Boolean);
  } else {
    if (userTicket) {
      const { data: requestorData } = await supabase
        .from('users')
        .select()
        .eq('user_id', userTicket.requestor_user_id)
        .single();
      requestor = requestorData;
    }
  }

  return (
    <div>
      {userTicket ? (
        <div>
          <h1>{outgoing ? 'Outgoing' : 'Incoming'} Ticket Details</h1>
          <p>Ticket ID: {userTicket.ticket_id}</p>
          <p>Date submitted: {userTicket.date_submitted}</p>
          <p>Store: {store.name} </p>
          <p>Store address: {store.street_address}</p>
          <p>Status: {userTicket.status}</p>
          <DeleteTicketButton ticketId={userTicket.ticket_id} />
          {outgoing ? (
            <div>
              <h2>Contact Store Admins</h2>
              {storeAdminsList.map((storeAdmin) => (
                <UserCard user={storeAdmin} key={storeAdmin.user_id}></UserCard>
              ))}
            </div>
          ) : (
            <div>
              <h2>Contact Requestor</h2>
              <UserCard user={requestor}></UserCard>
            </div>
          )}
          {InStockTicketItems.length > 0 ? (
            <div>
              <h2>In-Stock Requests</h2>
              <div>
                {InStockTicketItems.map((item) => (
                  <InStockTicketItemCard
                    key={item.ticket_item_id}
                    ticketItemId={item.ticket_item_id}
                    quantityRequested={item.quantity_requested}
                    quantityAvailable={item.store_items.quantity_available}
                    itemName={item.store_items.inventory_items.name}
                    photoUrl={
                      item.store_items.inventory_items.photo_url || null
                    }
                    subcategoryName={
                      item.store_items?.inventory_items?.subcategories?.name
                    }
                    categoryName={
                      item.store_items?.inventory_items?.subcategories
                        ?.categories?.name
                    }
                  />
                ))}
              </div>
            </div>
          ) : null}
          {OutOfStockTicketItems.length > 0 ? (
            <div>
              <h2>Out-of-Stock Requests</h2>
              <div>
                {OutOfStockTicketItems.map((item) => (
                  <OutOfStockTicketItemCard
                    key={item.ticket_item_id}
                    ticketItemId={item.ticket_item_id}
                    freeTextDescription={
                      item.free_text_description || 'No description'
                    }
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <p>No ticket found.</p>
      )}
    </div>
  );
}
