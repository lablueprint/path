'use server'; // directive that indicates that the functions we define are server actions

import { TicketInsert } from '@/app/types/ticket';
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
    return { success: false, error: err };
  }
  return { success: true, data: entry };
}

export async function deleteTicket(ticketId: string) {
  const supabase = await createClient();
  const { error: err } = await supabase
    .from('tickets')
    .delete()
    .eq('ticket_id', ticketId);

  if (err) {
    console.error('Error deleting ticket:', err);
    return { success: false, error: err };
  }
  return { success: true };
}

export async function updateTicketStatus(newStatus: string, ticketId: string) {
  const supabase = await createClient();
  const { error: err } = await supabase
    .from('tickets')
    .update({ status: newStatus })
    .eq('ticket_id', ticketId);

  if (err) {
    console.error('Error changing ticket status:', err);
    return { success: false, error: err };
  }
  return { success: true };
}
