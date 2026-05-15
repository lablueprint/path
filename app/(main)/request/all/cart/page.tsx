import { createClient } from '@/app/lib/supabase/server-client';
import TicketItemsList from '@/app/(main)/components/TicketItemsList';
import SubmitTicketButton from '@/app/(main)/request/components/SubmitTicketButton';
import Link from 'next/link';
import styles from '@/app/(main)/request/CartPage.module.css';
import Accordion from 'react-bootstrap/Accordion';
import AccordionBody from 'react-bootstrap/AccordionBody';
import AccordionHeader from 'react-bootstrap/AccordionHeader';
import AccordionItem from 'react-bootstrap/AccordionItem';
import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';
import TicketDestStoreDropdown from '@/app/(main)/components/TicketDestStoreDropdown';

type DraftTicket = {
  ticket_id: string;
  store_id: string;
  ticket_items: {
    count: number;
  }[];
};

export default async function AllCartsPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string; ticketId: string }>;
}) {
  const { submitted, ticketId } = await searchParams;
  const showSuccess = submitted === '1' && !!ticketId;
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>User not found</div>;
  }

  // Fetch stores
  const { data: stores, error: storesError } = await supabase
    .from('stores')
    .select('store_id, name, street_address')
    .order('name');

  if (storesError || !stores) {
    console.error('Error fetching stores:', storesError);
    return <div>Failed to load stores.</div>;
  }

  const sortedStores = stores.sort((a, b) => a.name.localeCompare(b.name));

  // Query all draft tickets for the current user, then index them by store.
  const { data: draftTickets, error: ticketError } = await supabase
    .from('tickets')
    .select('ticket_id, store_id, ticket_items(count)')
    .eq('requestor_user_id', user.id)
    .eq('status', 'draft');

  if (ticketError || !draftTickets) {
    return (
      <div>
        <Breadcrumbs
          labelMap={{
            request: 'Request Inventory',
            all: 'All Stores',
            cart: 'All Carts',
          }}
        />
        <h1>All Carts</h1>
        {sortedStores.map((store) => {
          return (
            <Accordion key={store.store_id}>
              <AccordionItem eventKey={store.store_id}>
                <AccordionHeader>{store.name}</AccordionHeader>
                <AccordionBody>
                  <div className={styles.itemsCard}>
                    <div className={styles.itemsCardHeader}>
                      <h1>ITEMS</h1>
                      <h2>0 in-stock · 0 out-of-stock</h2>
                    </div>
                  </div>
                </AccordionBody>
              </AccordionItem>
            </Accordion>
          );
        })}
        <div className={styles.itemsCard}>
          <div className={styles.itemsCardHeader}>
            <h1>ITEMS</h1>
            <h2>0 in-stock · 0 out-of-stock</h2>
          </div>
        </div>
      </div>
    );
  }

  const draftTicketByStore = draftTickets.reduce<Record<string, DraftTicket>>(
    (acc, ticket) => {
      acc[ticket.store_id] = ticket;
      return acc;
    },
    {},
  );

  return (
    <div>
      <Breadcrumbs
        labelMap={{
          request: 'Request Inventory',
          all: 'All Stores',
          cart: 'All Carts',
        }}
      />
      <h1>All Carts</h1>
      {sortedStores.map((store) => {
        const draftTicket = draftTicketByStore[store.store_id];

        return (
          <Accordion key={store.store_id}>
            <AccordionItem eventKey={store.store_id}>
              <AccordionHeader>{store.name}</AccordionHeader>
              <AccordionBody>
                <div>
                  <p>Ticket Destination Store: </p>
                  <TicketDestStoreDropdown
                    ticketId={ticketId}
                    currentDestStore={store.store_id}
                    destStoreOptions={stores
                      .filter((s) => s.store_id !== store.store_id)
                      .map((s) => ({
                        store: {
                          store_id: s.store_id,
                          name: s.name,
                          street_address: s.street_address,
                        },
                      }))}
                  />
                </div>
                {showSuccess && (
                  <div>
                    <p>Ticket submitted successfully!</p>
                    <Link href={`/outgoing-tickets/${ticketId}`}>
                      Go to ticket
                    </Link>
                  </div>
                )}
                {draftTicket ? (
                  <div>
                    <TicketItemsList ticketId={draftTicket.ticket_id} />
                    {draftTicket.ticket_items[0].count > 0 ? (
                      <SubmitTicketButton ticketId={draftTicket.ticket_id} />
                    ) : null}
                  </div>
                ) : (
                  <div className={styles.itemsCard}>
                    <div className={styles.itemsCardHeader}>
                      <h1>ITEMS</h1>
                      <h2>0 in-stock · 0 out-of-stock</h2>
                    </div>
                  </div>
                )}
              </AccordionBody>
            </AccordionItem>
          </Accordion>
        );
      })}
    </div>
  );
}
