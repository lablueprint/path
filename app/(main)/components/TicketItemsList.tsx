import { createClient } from '@/app/lib/supabase/server-client';
import OutOfStockTicketItemCard from '@/app/(main)/components/OutOfStockTicketItemCard';
import InStockTicketItemCard from '@/app/(main)/components/InStockTicketItemCard';
import RemoveTicketItemButton from '@/app/(main)/components/RemoveTicketItemButton';
import styles from '@/app/(main)/components/TicketItemsList.module.css';
import ticketStyles from '@/app/(main)/components/TicketDetails.module.css';

export default async function TicketItemsList({
  ticketId,
}: {
  ticketId: string;
}) {
  const supabase = await createClient();

  let InStockTicketItems = [];
  let OutOfStockTicketItems = [];
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
  const sortedInStockTicketItems = [...InStockTicketItems].sort((a, b) =>
    (a.store_items?.inventory_items?.name).localeCompare(
      b.store_items?.inventory_items?.name,
    ),
  );

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

  const totalTicketItems =
    InStockTicketItems.length + OutOfStockTicketItems.length;

  return (
    <div className={ticketStyles.card}>
      <div className={styles.itemsCardHeader}>
        <h2 className={ticketStyles.cardTitle}>Items</h2>
        <h2 className={styles.countText}>
          {InStockTicketItems.length} in-stock · {OutOfStockTicketItems.length}{' '}
          out-of-stock
        </h2>
      </div>
      {totalTicketItems > 0 ? (
        <>
          {InStockTicketItems.length > 0 ? (
            <div>
              <h2 className={styles.inStockHeader}>In-Stock Requests</h2>
              {sortedInStockTicketItems.map((item) => (
                <div
                  key={item.ticket_item_id}
                  className={ticketStyles.rowWrapper}
                >
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
                      item.store_items.inventory_items.subcategories.name
                    }
                    categoryName={
                      item.store_items.inventory_items.subcategories.categories
                        .name
                    }
                  />
                  <RemoveTicketItemButton ticketItemId={item.ticket_item_id} />
                </div>
              ))}
            </div>
          ) : null}
          {OutOfStockTicketItems.length > 0 ? (
            <div>
              <h2 className={styles.outOfStockHeader}>Out-of-Stock Requests</h2>
              {OutOfStockTicketItems.map((item) => (
                <div
                  key={item.ticket_item_id}
                  className={ticketStyles.rowWrapper}
                >
                  <OutOfStockTicketItemCard
                    key={item.ticket_item_id}
                    ticketItemId={item.ticket_item_id}
                    freeTextDescription={item.free_text_description || ''}
                  />
                  <RemoveTicketItemButton ticketItemId={item.ticket_item_id} />
                </div>
              ))}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
