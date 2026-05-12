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


type DraftTicket = {
  ticket_id: string;
  store_id: string;
};

export default async function AllCartsPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string; ticketId?: string }>;
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
    .select('store_id, name')
    .order('name');

  if (storesError || !stores) {
    console.error('Error fetching stores:', storesError);
    return <div>Failed to load stores.</div>;
  }

  // Query all draft tickets for the current user, then index them by store.
  const { data: draftTickets, error: ticketError } = await supabase
    .from('tickets')
    .select('ticket_id, store_id')
    .eq('requestor_user_id', user.id)
    .eq('status', 'draft');

  if (ticketError || !draftTickets) {
    console.error('Error fetching draft tickets:', ticketError);
    return (
      <div>
        <h1>All Carts</h1>
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

  const sortedStores = stores.sort((a, b) => a.name.localeCompare(b.name));

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
                    <SubmitTicketButton ticketId={draftTicket.ticket_id} />
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
