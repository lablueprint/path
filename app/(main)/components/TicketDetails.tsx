import { createClient } from '@/app/lib/supabase/server-client';
import TicketItemsList from '@/app/(main)/components/TicketItemsList';
import TicketLogistics from '@/app/(main)/components/TicketLogistics';
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
          store_id,
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
    store_id: string;
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
    <>
      {userTicket ? (
        <>
          {/*Header Card*/}
          <Card className={styles.headerCard}>
            <Row className={styles.headerCardRow}>
              <Col xs={12} className={styles.headerCardMain}>
                <Image
                  src={requestor?.profile_photo_url || imagePlaceholder}
                  alt={requestor?.first_name + ' ' + requestor?.last_name}
                  className={styles.profilePicture}
                  width={96}
                  height={96}
                  unoptimized
                ></Image>
                <div>
                  <h1>{`${requestor?.first_name + ' ' + requestor?.last_name}'s Ticket`}</h1>
                  <p>
                    Submitted{' '}
                    {new Date(userTicket.date_submitted).toLocaleString(
                      'en-US',
                      {
                        timeZone: 'America/Los_Angeles',
                      },
                    )}
                  </p>
                  <p>Ticket #{userTicket.ticket_id}</p>
                </div>
              </Col>
              <Col
                xs={12}
                className={`${styles.headerCardContact} d-flex flex-column gap-2`}
              >
                {!outgoing && (
                  <div className="align-self-start align-self-md-end">
                    <Button
                      as="a"
                      className="btn-submit btn-sm"
                      href={
                        requestor?.email
                          ? `mailto:${requestor.email}`
                          : undefined
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      disabled={!requestor?.email}
                    >
                      Contact Requestor
                    </Button>
                  </div>
                )}
                <div className="align-self-start align-self-md-end">
                  <TicketStatusDropdown
                    ticketId={userTicket.ticket_id}
                    currentStatus={userTicket.status as TicketStatus}
                    statusOptions={statusOptions}
                  />
                </div>
                <DeleteTicketButton ticketId={userTicket.ticket_id} />
              </Col>
            </Row>
          </Card>

          <Row>
            <Col xs={12} xl={8} className="pe-xl-2 mb-3 mb-xl-0">
              <TicketItemsList ticketId={userTicket.ticket_id} />
            </Col>

            <Col xs={12} xl={4} className="ps-xl-2 gap-container">
              {outgoing && (
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>Contact Store Admins</h2>
                  </div>
                  {sortedStoreAdminsList.length > 0 ? (
                    sortedStoreAdminsList.map((storeAdmin) => (
                      <div
                        key={storeAdmin.user_id}
                        className={styles.rowWrapper}
                      >
                        <TicketUserCard user={storeAdmin} />
                      </div>
                    ))
                  ) : (
                    <div className={styles.rowWrapper}>No admins found.</div>
                  )}
                </div>
              )}
              <TicketLogistics
                ticketId={ticketId}
                sourceStore={store}
                currentDestStore={(currentDestStore as Store) || null}
                destStoreOptions={(destStoreOptions ?? []).map((store) => ({
                  store,
                }))}
              />
            </Col>
          </Row>
        </>
      ) : (
        <>No ticket found.</>
      )}
    </>
  );
}
