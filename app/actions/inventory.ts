'use server';

import { InventoryItem, InventoryItemInsert, InventoryItemUpdate } from '@/app/types/inventory';
import { createClient } from '@/app/lib/supabase/server-client';

export const createItem = async (data: InventoryItemInsert) => {
  const supabase = await createClient();
  const { data: entry, error: err } = await supabase
    .from('inventory_items')
    .insert(data)
    .select()
    .single();

  if (err) {
    console.error('Error creating inventory item:', err);
    return { success: false, data: null, error: err.message };
  }
  return { success: true, data: entry as InventoryItem };
};

export const updateItem = async (
  inventoryItemId: string,
  data: InventoryItemUpdate,
) => {
  const supabase = await createClient();
  const { data: entry, error: err } = await supabase
    .from('inventory_items')
    .update(data)
    .eq('inventory_item_id', inventoryItemId)
    .select()
    .single();

  if (err) {
    console.error('Error updating inventory item:', err);
    return { success: false, data: null, error: err.message };
  }
  return { success: true, data: entry as InventoryItem };
};

export const deleteItem = async (inventoryItemId: string) => {
  const supabase = await createClient();
  const { error: err } = await supabase
    .from('inventory_items')
    .delete()
    .eq('inventory_item_id', inventoryItemId);

  if (err) {
    console.error('Error deleting inventory item:', err);
    return { success: false, error: err.message };
  }
  return { success: true };
};
