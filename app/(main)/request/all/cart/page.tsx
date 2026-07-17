import { createClient } from '@/app/lib/supabase/server-client';
import TicketItemsList from '@/app/(main)/components/TicketItemsList';
import SubmitTicketButton from '@/app/(main)/request/components/SubmitTicketButton';
import TicketLogistics from '@/app/(main)/components/TicketLogistics';
import Accordion from 'react-bootstrap/Accordion';
import AccordionBody from 'react-bootstrap/AccordionBody';
import AccordionHeader from 'react-bootstrap/AccordionHeader';
import AccordionItem from 'react-bootstrap/AccordionItem';
import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';
import accordionStyles from '@/app/(main)/request/all/Accordion.module.css';
import AddOutOfStockToCartForm from '@/app/(main)/request/components/AddOutOfStockToCartForm';

type DraftTicket = {
  ticket_id: string;
  store_id: string;
  ticket_items: {
    count: number;
  }[];
  stores: {
    store_id: string;
    name: string;
    street_address: string;
  };
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
    .select(
      'ticket_id, store_id, ticket_items(count), stores!fk_dest_stores(*)',
    )
    .eq('requestor_user_id', user.id)
    .eq('status', 'draft')
    .overrideTypes<DraftTicket[], { merge: false }>();

  if (ticketError || !draftTickets) {
    console.log(ticketError);
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
                    <AddOutOfStockToCartForm storeId={store.store_id} />
                    {draftTicket.ticket_items[0].count > 0 ? (
                      <>
                        <TicketLogistics
                          ticketId={draftTicket.ticket_id}
                          sourceStore={store}
                          currentDestStore={draftTicket.stores}
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
                        <SubmitTicketButton ticketId={draftTicket.ticket_id} />
                      </>
                    ) : null}
                  </div>
                ) : (
                  <div className="gap-container">
                    <TicketItemsList ticketId={null} />
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
