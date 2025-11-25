"use server";

import { InventoryType } from "@/app/types/InventoryItem";
import { createClient } from "@/app/lib/supabase/server-client"; 

export const createItem = async (data: InventoryType) => {
    const supabase = await createClient();
    const { error } = await supabase.from("inventory_items").insert(data);
  
    if (error) {
      throw error;
    }
    return entry;
}

export const changeItemQuantity = async (data: InventoryType) => {
    const supabase = await createClient();
    const { data: entry, error } = await supabase.from("example").insert(data);
  
    if (error) {
      throw error;
    }
    return entry;
}

export const deleteItem = async (data: InventoryType) => {
    const supabase = await createClient();
    const { data: entry, error } = await supabase.from("example").insert(data);
  
    if (error) {
      throw error;
    }
    return entry;
  }