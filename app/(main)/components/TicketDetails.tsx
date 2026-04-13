import { createClient } from '@/app/lib/supabase/server-client';
import TicketItemsList from '@/app/(main)/components/TicketItemsList';
import UserCard from '@/app/(main)/components/UserCard';
import { User } from '@/app/types/user';
import TicketStatusDropdown from '@/app/(main)/components/TicketStatusDropdown';

type TicketStatus = 'draft' | 'requested' | 'ready' | 'rejected' | 'fulfilled';

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

  const getOutgoingStatusOptions = (status: TicketStatus): TicketStatus[] => {
    switch (status) {
      case 'requested':
        return ['requested'];
      case 'ready':
        return ['ready', 'fulfilled'];
      case 'rejected':
        return ['rejected'];
      case 'fulfilled':
        return ['fulfilled'];
      default:
        return [status];
    }
  };

  const getIncomingStatusOptions = (status: TicketStatus): TicketStatus[] => {
    switch (status) {
      case 'requested':
        return ['requested', 'ready', 'rejected'];
      case 'ready':
        return ['requested', 'ready', 'rejected', 'fulfilled'];
      case 'rejected':
        return ['requested', 'ready', 'rejected', 'fulfilled'];
      case 'fulfilled':
        return ['fulfilled'];
      default:
        return [status];
    }
  };

  const statusOptions = outgoing
    ? getOutgoingStatusOptions(userTicket.status as TicketStatus)
    : getIncomingStatusOptions(userTicket.status as TicketStatus);

  return (
    <div>
      {userTicket ? (
        <div>
          <h1>{outgoing ? 'Outgoing' : 'Incoming'} Ticket Details</h1>
          <p>Ticket ID: {userTicket.ticket_id}</p>
          <p>Date submitted: {userTicket.date_submitted}</p>
          <p>Store: {store.name} </p>
          <p>Store address: {store.street_address}</p>
          <div>
            <p>Status: </p>
            <TicketStatusDropdown
              storeId={userTicket.store_id}
              ticketId={userTicket.ticket_id}
              currentStatus={userTicket.status as TicketStatus}
              statusOptions={statusOptions}
            />
          </div>

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
