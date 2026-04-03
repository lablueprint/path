import { createClient } from '@/app/lib/supabase/server-client';
import OutOfStockTicketItemCard from '@/app/(main)/components/OutOfStockTicketItemCard';
import InStockTicketItemCard from '@/app/(main)/components/InStockTicketItemCard';
import { deleteTicketItem } from '@/app/actions/ticket';
import React from 'react';

interface InStockTicketItem {
  ticket_item_id: string;
  ticket_id: string;
  store_item_id: string;
  quantity_requested: number;
  free_text_description: string;
  is_in_stock_request: boolean;
  store_items?: {
    quantity_available?: number;
    inventory_items?: {
      name?: string;
      photo_url?: string;
      subcategories?: {
        name?: string;
        categories?: {
          name?: string;
        };
      };
    };
  };
}

interface OutOfStockTicketItem {
  ticket_item_id: string;
  free_text_description: string | null;
}

export default async function TicketItemsList({
  ticketId,
}: {
  ticketId: string;
}) {
  const supabase = await createClient();

  let InStockTicketItems: InStockTicketItem[] = [];
  let OutOfStockTicketItems: OutOfStockTicketItem[] = [];

  const { data: items } = await supabase
    .from('ticket_items')
    .select(
      `*,
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
  InStockTicketItems = items || [];

  const { data: outOfStock } = await supabase
    .from('ticket_items')
    .select(
      `ticket_item_id,
			free_text_description
		`,
    )
    .eq('ticket_id', ticketId)
    .eq('is_in_stock_request', false);
  OutOfStockTicketItems = outOfStock || [];

  async function handleRemove(ticketItemId: string) {
    'use server';
    await deleteTicketItem(ticketItemId);
  }

  return (
    <>
      {InStockTicketItems.length > 0 && (
        <div>
          <h2>In-Stock Requests</h2>
          <div>
            {InStockTicketItems.map((item) => (
              <div
                key={item.ticket_item_id}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <InStockTicketItemCard
                  ticketItemId={item.ticket_item_id}
                  quantityRequested={item.quantity_requested}
                  quantityAvailable={item.store_items?.quantity_available || 0}
                  itemName={
                    item.store_items?.inventory_items?.name || 'Unknown'
                  }
                  photoUrl={item.store_items?.inventory_items?.photo_url || ''}
                  subcategoryName={
                    item.store_items?.inventory_items?.subcategories?.name ||
                    'Unknown'
                  }
                  categoryName={
                    item.store_items?.inventory_items?.subcategories?.categories
                      ?.name || 'Unknown'
                  }
                />
                <form
                  action={async () => {
                    await handleRemove(item.ticket_item_id);
                  }}
                >
                  <button type="submit">Remove</button>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}
      {OutOfStockTicketItems.length > 0 && (
        <div>
          <h2>Out-of-Stock Requests</h2>
          <div>
            {OutOfStockTicketItems.map((item) => (
              <div
                key={item.ticket_item_id}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <OutOfStockTicketItemCard
                  ticketItemId={item.ticket_item_id}
                  freeTextDescription={
                    item.free_text_description || 'No description'
                  }
                />
                <form
                  action={async () => {
                    await handleRemove(item.ticket_item_id);
                  }}
                >
                  <button type="submit">Remove</button>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
