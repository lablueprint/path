import { createClient } from '@/app/lib/supabase/server-client';
import TicketItemsList from '@/app/(main)/components/TicketItemsList';
import DeleteTicketButton from '@/app/(main)/components/DeleteTicketButton';
import TicketUserCard from '@/app/(main)/components/TicketUserCard';
import { User } from '@/app/types/user';
import TicketStatusDropdown from '@/app/(main)/components/TicketStatusDropdown';
import styles from '@/app/(main)/components/TicketDetails.module.css';
import { Card, Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Image from 'next/image';
import imagePlaceholder from '@/public/image-placeholder.svg';
import { Store } from '@/app/types/store';
import TicketDestStoreDropdown from './TicketDestStoreDropdown';

type TicketStatus =
  | 'draft'
  | 'requested'
  | 'ready'
  | 'rejected'
  | 'fulfilled'
  | 'approved';

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
        store_id, ticket_id, requestor_user_id, status, date_submitted, dest_store_id,
        stores!fk_stores (
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
  }
  const sortedStoreAdminsList = [...storeAdminsList].sort((a, b) =>
    a.first_name.localeCompare(b.first_name),
  );

  if (userTicket) {
    const { data: requestorData } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userTicket.requestor_user_id)
      .single();
    requestor = requestorData;
  }

  const getOutgoingStatusOptions = (status: TicketStatus): TicketStatus[] => {
    switch (status) {
      case 'requested':
        return ['requested'];
      case 'approved':
        return ['approved'];
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
        return ['requested', 'approved', 'rejected'];
      case 'approved':
        return ['requested', 'approved', 'rejected', 'ready'];
      case 'ready':
        return ['requested', 'approved', 'rejected', 'ready', 'fulfilled'];
      case 'rejected':
        return ['requested', 'approved', 'rejected'];
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

  // If ticket exists, query for dest store options
  const { data: destStoreOptions, error: destStoreOptionsError } =
    await supabase
      .from('stores')
      .select('store_id, name, street_address')
      .neq('store_id', userTicket.store_id);
  if (destStoreOptionsError) {
    console.error(
      'Error fetching destination store options:',
      destStoreOptionsError,
    );
  }

  // If ticket exists, query for current dest store
  const { data: currentDestStore } = await supabase
    .from('stores')
    .select('store_id, name, street_address')
    .eq('store_id', userTicket.dest_store_id)
    .single();

  return (
    <div>
      {userTicket ? (
        <div>
          {/*Header Card*/}
          <Card className={styles.headerCard}>
            <Row className={styles.headerCardRow}>
              <Col xs={12} className={styles.headerCardMain}>
                <Image
                  src={requestor?.profile_photo_url || imagePlaceholder}
                  alt={requestor?.first_name + ' ' + requestor?.last_name}
                  className={styles.profilePicture}
                  width={95}
                  height={95}
                  unoptimized
                ></Image>
                <div className={styles.headerCardText}>
                  <h1>{`${requestor?.first_name + ' ' + requestor?.last_name}'s Ticket`}</h1>
                  <h2>Submitted {formatDate(userTicket.date_submitted)}</h2>
                  <h2>Ticket #{userTicket.ticket_id}</h2>
                </div>
              </Col>
              {!outgoing ? (
                <Col xs={12} className={styles.headerCardContact}>
                  <Button
                    as="a"
                    className={styles.contactButton}
                    href={
                      requestor?.email ? `mailto:${requestor.email}` : undefined
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    disabled={!requestor?.email}
                  >
                    Contact
                  </Button>
                </Col>
              ) : null}
            </Row>
          </Card>

          <div>
            <p>Status: </p>
            <TicketStatusDropdown
              ticketId={userTicket.ticket_id}
              currentStatus={userTicket.status as TicketStatus}
              statusOptions={statusOptions}
            />
          </div>
          <div>
            <p>Ticket Destination Store: </p>
            <TicketDestStoreDropdown
              ticketId={ticketId}
              currentDestStore={(currentDestStore as Store) || null}
              destStoreOptions={(destStoreOptions ?? []).map((store) => ({
                store,
              }))}
            />
          </div>

          <DeleteTicketButton ticketId={userTicket.ticket_id} />

          <Row className={styles.ticketContentLayout}>
            <Col xs={12} className={styles.ticketContentMain}>
              <TicketItemsList ticketId={userTicket.ticket_id} />
            </Col>

            <Col
              xs={12}
              className={`${styles.ticketContentSide} ${styles.ticketContentRight}`}
            >
              {outgoing && (
                <div className={styles.adminCard}>
                  <h2>CONTACT STORE ADMINS</h2>
                  {sortedStoreAdminsList.map((storeAdmin) => (
                    <TicketUserCard
                      user={storeAdmin}
                      key={storeAdmin.user_id}
                    ></TicketUserCard>
                  ))}
                </div>
              )}

              <div className={styles.adminCard}>
                <h2>TICKET LOCATION</h2>
                <div className={styles.locationCardContent}>
                  <p>
                    <strong>Store:</strong> {store.name}
                  </p>
                  <p>
                    <strong>Store Address:</strong> {store.street_address}
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      ) : (
        <p>No ticket found.</p>
      )}
    </div>
  );
}
