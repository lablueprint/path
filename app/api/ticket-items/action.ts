"use server";

import { createClient } from "@/app/lib/supabase/server-client";

export async function createTicketItem(ticketItemData) {
  const supabase = await createClient();
  // Server Action uses a mutation method
  const { error } = await supabase.from("ticket_items").insert({
    // ticket_item_id: removed since db auto generates
    ticket_id: ticketItemData.get("ticket_id"),
    inventory_item_id: ticketItemData.get("inventory_item_id") ?? null,
    free_text_description: ticketItemData.get("free_text_description") ?? null,
    quantity_requested: ticketItemData.get("quantity_requested") ?? null,
    is_in_stock_request: ticketItemData.get("is_in_stock_request"),
  });
  //.select().single() <- kept only for debugging to see inserted entry
  if (error) {
    console.error("Error inserting ticket item:", error);
    throw new Error(error.message);
  }
}

export async function changeTicketItemQuantity(
  ticketItemId: string,
  newQuantity: number | null
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("ticket_items")
    .update({ quantity_requested: newQuantity })
    .eq("ticket_item_id", ticketItemId);
  if (error) {
    console.log("Error updating ticket item:", error);
    throw new Error(error.message);
  }
}

export async function changeTicketItemDescription(
  ticket_item_id: string,
  newDescription: string
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("ticket_items")
    .update({ free_text_description: newDescription })
    .eq("ticket_item_id", ticket_item_id);
  if (error) {
    console.log("Error updating ticket free text description:", error);
    throw new Error(error.message);
  }
}

export async function deleteTicketItem(ticket_item_id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("ticket_items")
    .delete()
    .eq("ticket_item_id", ticket_item_id);
  if (error) {
    console.log("Error deleting ticket:", error);
    throw new Error(error.message);
  }
}
