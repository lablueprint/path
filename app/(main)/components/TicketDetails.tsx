import { createClient } from '@/app/lib/supabase/server-client';
import TicketItemsList from '@/app/(main)/components/TicketItemsList';
import DeleteTicketButton from '@/app/(main)/components/DeleteTicketButton';
import UserCard from '@/app/(main)/components/UserCard';
import { User } from '@/app/types/user';
import TicketStatusDropdown from '@/app/(main)/components/TicketStatusDropdown';
import styles from '@/app/(main)/components/TicketDetails.module.css';
import { Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Image from 'next/image';

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
  };

  return (
    <div>
      {userTicket ? (
        <div>
          <h1>{outgoing ? 'Outgoing' : 'Incoming'} Ticket Details</h1>
          <p>Ticket ID: {userTicket.ticket_id}</p>
          <p>Date submitted: {userTicket.date_submitted}</p>
          <p>Store: {store.name} </p>
          <p>Store address: {store.street_address}</p>
          <Card className={styles.headerCard}>
            <Image
              src={
                requestor.profile_photo_url || '/default-profile-picture.png'
              }
              alt={`Profile picture for ${requestor.first_name}`}
              className={styles.profilePicture}
              width={95}
              height={95}
              unoptimized
            ></Image>
            <div className={styles.headerCardText}>
              <h1>{`${requestor.first_name + ' ' + requestor.last_name}'s Ticket`}</h1>
              <h2>Submitted {formatDate(userTicket.date_submitted)}</h2>
              <h2>Ticket #{userTicket.ticket_id}</h2>
            </div>
            <Button className={styles.contactButton}>Contact</Button>
          </Card>
          <div>
            <p>Status: </p>
            <TicketStatusDropdown
              ticketId={userTicket.ticket_id}
              currentStatus={userTicket.status as TicketStatus}
              statusOptions={statusOptions}
            />
          </div>

          <DeleteTicketButton ticketId={userTicket.ticket_id} />
          {outgoing ? (
            <div className={styles.contactStoreAdmins}>
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
