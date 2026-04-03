'use server'; // directive that indicates that the functions we define are server actions

import {
  Ticket,
  TicketInsert,
  TicketItem,
  TicketItemInsert,
} from '@/app/types/ticket';
import { createClient } from '@/app/lib/supabase/server-client';
import { revalidatePath } from 'next/cache';

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

  revalidatePath(`/request/${entry.store_id}/cart`);

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

  // Get the ticket to retrieve storeId
  const { data: ticket } = await supabase
    .from('tickets')
    .select('store_id')
    .eq('ticket_id', entry.ticket_id)
    .single();

  revalidatePath(`/request/${ticket?.store_id}/cart`);
  revalidatePath(`/outgoing-tickets/${entry.ticket_id}`);
  revalidatePath(`/incoming-tickets/${ticket?.store_id}/${entry.ticket_id}`);

  return { success: true, data: entry as TicketItem };
}

export async function addToCart(
  storeId: string,
  storeItemId?: string,
  quantity?: number,
  description?: string,
) {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Error fetching user:', userError);
    return {
      success: false,
      data: null,
      error: userError?.message || 'No user found',
    };
  }

  // Get or create draft ticket for current user (manual upsert)

  // Try to find existing draft ticket
  const { data: existingTicket, error: fetchError } = await supabase
    .from('tickets')
    .select('*')
    .eq('requestor_user_id', user.id)
    .eq('store_id', storeId)
    .eq('status', 'draft')
    .maybeSingle();

  if (fetchError) {
    return { success: false, data: null, error: fetchError.message };
  }

  // If it exists → use existing ticket
  let ticket = existingTicket;

  if (!ticket) {
    // Otherwise, create a ticket
    const { data: newTicket, error: insertError } = await supabase
      .from('tickets')
      .insert({
        requestor_user_id: user.id,
        store_id: storeId,
        status: 'draft',
      })
      .select()
      .single();

    if (insertError) {
      return { success: false, data: null, error: insertError.message };
    }

    ticket = newTicket;
  }

  // If storeItemId and quantity are provided
  if (storeItemId && quantity) {
    // Check if there is ticket item with appropriate ticket_id and store_item_id
    // Select the ticket_id and quantity_requested if so
    const { data: existingItem } = await supabase
      .from('ticket_items')
      .select('ticket_id, quantity_requested')
      .eq('ticket_id', ticket.ticket_id)
      .eq('store_item_id', storeItemId)
      .maybeSingle();

    // If ticket item already exists, incremented by quantity, if does not exist, set to quantity
    const newQuantity = existingItem
      ? existingItem.quantity_requested + quantity
      : quantity;

    // Get or create a ticket item in ticket_items table
    const { data: ticketItem, error: itemError } = await supabase
      .from('ticket_items')
      .upsert(
        {
          ticket_id: ticket.ticket_id,
          store_item_id: storeItemId,
          quantity_requested: newQuantity,
          is_in_stock_request: true,
        },
        {
          onConflict: 'ticket_id,store_item_id',
        },
      )
      .select()
      .single();

    if (itemError) {
      return { success: false, data: null, error: itemError.message };
    }

    return { success: true, data: ticketItem };
  }

  // If description is provided
  if (description) {
    // Create a ticket item in ticket_items
    const { data: ticketItem, error: itemError } = await supabase
      .from('ticket_items')
      .insert({
        ticket_id: ticket.ticket_id,
        free_text_description: description,
        is_in_stock_request: false,
      })
      .select()
      .single();

    if (itemError) {
      return { success: false, data: null, error: itemError.message };
    }

    return { success: true, data: ticketItem };
  }

  return { success: true, data: ticket };
}
