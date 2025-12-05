"use server";

import { InventoryType } from "@/app/types/InventoryItem";
import { createClient } from "@/app/lib/supabase/server-client"; 

export const createItem = async (data: InventoryType) => {
    const supabase = await createClient();
    const { data: entry, error } = await supabase.from("inventory_items").insert(data);
  
    if (error) {
      throw error;
    }
    return entry;
}

export const changeItemQuantity = async (inventoryId: string, updatedAvailableQuantity: number) => {
    const supabase = await createClient();
    const { data: entry, error } = await supabase
      .from("inventory_items")
      .update({ quantity_available: updatedAvailableQuantity })
      .eq("inventory_item_id", inventoryId);
  
    if (error) {
      throw error;
    }
    return entry;
}

export const deleteItem = async (inventoryId: string) => {
    const supabase = await createClient();
    const { data: entry, error } = await supabase
      .from("inventory_items")
      .delete()
      .eq("inventory_item_id", inventoryId);
  
    if (error) {
      throw error;
    }
    return entry;
  }