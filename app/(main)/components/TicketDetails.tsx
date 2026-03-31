import { createClient } from '@/app/lib/supabase/server-client';
import TicketItemsList from '@/app/(main)/components/TicketItemsList';
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
      `store_id, ticket_id, requestor_user_id, status, date_submitted,
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
  

  const store = userTicket.stores as unknown as {
    name: string;
    street_address: string;
  };

  let storeAdminsList: User[] = [];
  let requestor = null;
  if (outgoing) {
    const { data: storeAdmins } = await supabase
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
    storeAdminsList = (storeAdmins || [])
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
          <TicketItemsList ticketId={userTicket.ticket_id} />
        </div>
      ) : (
        <p>No ticket found.</p>
      )}
    </div>
  );
}
