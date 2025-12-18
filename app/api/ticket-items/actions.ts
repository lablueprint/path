'use server';

import { TicketItemInsert } from '@/app/types/ticket';
import { createClient } from '@/app/lib/supabase/server-client';

export async function createTicketItem(data: TicketItemInsert) {
  const supabase = await createClient();
  // Server Action uses a mutation method
  const { data: entry, error: err } = await supabase
    .from('ticket_items')
    .insert(data)
    .select()
    .single();

  if (err) {
    console.error('Error creating ticket item:', err);
    return { success: false, error: err };
  }
  return { success: true, data: entry };
}

export async function changeTicketItemQuantity(
  ticketItemId: string,
  newQuantity: number,
) {
  const supabase = await createClient();
  const { error: err } = await supabase
    .from('ticket_items')
    .update({ quantity_requested: newQuantity })
    .eq('ticket_item_id', ticketItemId);

  if (err) {
    console.error('Error changing ticket item quantity:', err);
    return { success: false, error: err };
  }
  return { success: true };
}

export async function changeTicketItemDescription(
  ticketItemId: string,
  newDescription: string,
) {
  const supabase = await createClient();
  const { error: err } = await supabase
    .from('ticket_items')
    .update({ free_text_description: newDescription })
    .eq('ticket_item_id', ticketItemId);

  if (err) {
    console.error('Error changing ticket item description:', err);
    return { success: false, error: err };
  }
  return { success: true };
}

export async function deleteTicketItem(ticketItemId: string) {
  const supabase = await createClient();
  const { error: err } = await supabase
    .from('ticket_items')
    .delete()
    .eq('ticket_item_id', ticketItemId);

  if (err) {
    console.error('Error deleting ticket item:', err);
    return { success: false, error: err };
  }
  return { success: true };
}
