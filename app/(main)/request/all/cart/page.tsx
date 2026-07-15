import { createClient } from '@/app/lib/supabase/server-client';
import TicketItemsList from '@/app/(main)/components/TicketItemsList';
import SubmitTicketButton from '@/app/(main)/request/components/SubmitTicketButton';
import styles from '@/app/(main)/request/CartPage.module.css';
import Accordion from 'react-bootstrap/Accordion';
import AccordionBody from 'react-bootstrap/AccordionBody';
import AccordionHeader from 'react-bootstrap/AccordionHeader';
import AccordionItem from 'react-bootstrap/AccordionItem';
import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';
import TicketDestStoreDropdown from '@/app/(main)/components/TicketDestStoreDropdown';
import accordionStyles from '@/app/(main)/request/all/Accordion.module.css';
import AddOutOfStockToCartForm from '@/app/(main)/request/components/AddOutOfStockToCartForm';

type DraftTicket = {
  ticket_id: string;
  store_id: string;
  ticket_items: {
    count: number;
  }[];
};

export default async function AllCartsPage() {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <>User not found.</>;
  }

  // Fetch stores
  const { data: stores, error: storesError } = await supabase
    .from('stores')
    .select('store_id, name, street_address')
    .order('name');

  if (storesError || !stores) {
    console.error('Error fetching stores:', storesError);
    return <>Failed to load stores.</>;
  }

  const sortedStores = stores.sort((a, b) => a.name.localeCompare(b.name));

  // Query all draft tickets for the current user, then index them by store.
  const { data: draftTickets, error: ticketError } = await supabase
    .from('tickets')
    .select('ticket_id, store_id, ticket_items(count)')
    .eq('requestor_user_id', user.id)
    .eq('status', 'draft');

  if (ticketError || !draftTickets) {
    return <>Failed to load carts.</>;
  }

  const draftTicketByStore = draftTickets.reduce<Record<string, DraftTicket>>(
    (acc, ticket) => {
      acc[ticket.store_id] = ticket;
      return acc;
    },
    {},
  );

  return (
    <>
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
            <AccordionItem
              eventKey={store.store_id}
              className={accordionStyles.accordionBody}
            >
              <AccordionHeader>{store.name}</AccordionHeader>
              <AccordionBody className={accordionStyles.accordionBodySpacing}>
                {draftTicket ? (
                  <div className="gap-container">
                    <TicketItemsList ticketId={draftTicket.ticket_id} />
                    <h2>Out-of-Stock Request</h2>
                    <AddOutOfStockToCartForm storeId={store.store_id} />
                    {draftTicket.ticket_items[0].count > 0 ? (
                      <>
                        <h2>Ticket Destination Store</h2>
                        <div className="d-flex">
                          <TicketDestStoreDropdown
                            ticketId={draftTicket.ticket_id}
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
                        <SubmitTicketButton ticketId={draftTicket.ticket_id} />
                      </>
                    ) : null}
                  </div>
                ) : (
                  <div className="gap-container">
                    <div className={styles.itemsCard}>
                      <div className={styles.itemsCardHeader}>
                        <h1>ITEMS</h1>
                        <h2>0 in-stock · 0 out-of-stock</h2>
                      </div>
                    </div>
                    <h2>Out-of-Stock Request</h2>
                    <AddOutOfStockToCartForm storeId={store.store_id} />
                  </div>
                )}
              </AccordionBody>
            </AccordionItem>
          </Accordion>
        );
      })}
    </>
  );
}
