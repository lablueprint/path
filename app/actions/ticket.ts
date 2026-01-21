'use server'; // directive that indicates that the functions we define are server actions

import {
  Ticket,
  TicketInsert,
  TicketItem,
  TicketItemInsert,
} from '@/app/types/ticket';
import { createClient } from '@/app/lib/supabase/server-client';

export async function createTicket(data: TicketInsert) {
  const supabase = await createClient();
  // pulling out the error from the insert into tickets table
  const { data: entry, error: err } = await supabase
    .from('tickets')
    .insert(data)
    .select()
    .single();

  if (err) {
    console.error('Error creating ticket:', err);
    return { success: false, data: null, error: err.message };
  }
  return { success: true, data: entry as Ticket };
}

export async function deleteTicket(ticketId: string) {
  const supabase = await createClient();
  const { data: entry, error: err } = await supabase
    .from('tickets')
    .delete()
    .eq('ticket_id', ticketId)
    .select()
    .single();

  if (err) {
    console.error('Error deleting ticket:', err);
    return { success: false, data: null, error: err.message };
  }
  return { success: true, data: entry as Ticket };
}

export async function updateTicketStatus(newStatus: string, ticketId: string) {
  const supabase = await createClient();
  const { data: entry, error: err } = await supabase
    .from('tickets')
    .update({ status: newStatus })
    .eq('ticket_id', ticketId)
    .select()
    .single();

  if (err) {
    console.error('Error changing ticket status:', err);
    return { success: false, data: null, error: err.message };
  }
  return { success: true, data: entry as Ticket };
}

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
    return { success: false, data: null, error: err.message };
  }
  return { success: true, data: entry as TicketItem };
}

export async function updateTicketItemQuantity(
  ticketItemId: string,
  newQuantity: number,
) {
  const supabase = await createClient();
  const { data: entry, error: err } = await supabase
    .from('ticket_items')
    .update({ quantity_requested: newQuantity })
    .eq('ticket_item_id', ticketItemId)
    .select()
    .single();

  if (err) {
    console.error('Error changing ticket item quantity:', err);
    return { success: false, data: null, error: err.message };
  }
  return { success: true, data: entry as TicketItem };
}

export async function updateTicketItemDescription(
  ticketItemId: string,
  newDescription: string,
) {
  const supabase = await createClient();
  const { data: entry, error: err } = await supabase
    .from('ticket_items')
    .update({ free_text_description: newDescription })
    .eq('ticket_item_id', ticketItemId)
    .select()
    .single();

  if (err) {
    console.error('Error changing ticket item description:', err);
    return { success: false, data: null, error: err.message };
  }
  return { success: true, data: entry as TicketItem };
}

export async function deleteTicketItem(ticketItemId: string) {
  const supabase = await createClient();
  const { data: entry, error: err } = await supabase
    .from('ticket_items')
    .delete()
    .eq('ticket_item_id', ticketItemId)
    .select()
    .single();

  if (err) {
    console.error('Error deleting ticket item:', err);
    return { success: false, data: null, error: err.message };
  }
  return { success: true, data: entry as TicketItem };
}
