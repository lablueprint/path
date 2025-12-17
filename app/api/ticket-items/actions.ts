'use server';

import { TicketItemInsert } from '@/app/types/ticket';
import { createClient } from '@/app/lib/supabase/server-client';

export async function createTicketItem(ticketItemData: TicketItemInsert) {
  const supabase = await createClient();
  // Server Action uses a mutation method
  const { error } = await supabase.from('ticket_items').insert(ticketItemData);
  //.select().single(); <- kept only for debugging to see inserted entry
  if (error) {
    console.error('Error inserting ticket item:', error);
    throw new Error(error.message);
  }
}

export async function changeTicketItemQuantity(
  ticketItemId: string,
  newQuantity: number | null,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('ticket_items')
    .update({ quantity_requested: newQuantity })
    .eq('ticket_item_id', ticketItemId);
  if (error) {
    console.log('Error updating ticket item:', error);
    throw new Error(error.message);
  }
}

export async function changeTicketItemDescription(
  ticketItemId: string,
  newDescription: string,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('ticket_items')
    .update({ free_text_description: newDescription })
    .eq('ticket_item_id', ticketItemId);
  if (error) {
    console.log('Error updating ticket free text description:', error);
    throw new Error(error.message);
  }
}

export async function deleteTicketItem(ticketItemId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('ticket_items')
    .delete()
    .eq('ticket_item_id', ticketItemId);
  if (error) {
    console.log('Error deleting ticket:', error);
    throw new Error(error.message);
  }
}
