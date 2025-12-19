'use server';

import { InventoryItemInsert } from '@/app/types/inventory';
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
    return { success: false, error: err };
  }
  return { success: true, data: entry };
};

export const changeItemQuantity = async (
  inventoryItemId: string,
  newQuantity: number,
) => {
  const supabase = await createClient();
  const { error: err } = await supabase
    .from('inventory_items')
    .update({ quantity_available: newQuantity })
    .eq('inventory_item_id', inventoryItemId);

  if (err) {
    console.error('Error changing inventory item quantity:', err);
    return { success: false, error: err };
  }
  return { success: true };
};

export const deleteItem = async (inventoryItemId: string) => {
  const supabase = await createClient();
  const { error: err } = await supabase
    .from('inventory_items')
    .delete()
    .eq('inventory_item_id', inventoryItemId);

  if (err) {
    console.error('Error deleting inventory item:', err);
    return { success: false, error: err };
  }
  return { success: true };
};
