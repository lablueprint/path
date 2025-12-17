'use server';

import { InventoryItemInsert } from '@/app/types/inventory';
import { createClient } from '@/app/lib/supabase/server-client';

export const createItem = async (data: InventoryItemInsert) => {
  const supabase = await createClient();
  const { error } = await supabase.from('inventory_items').insert(data);

  if (error) {
    throw error;
  }
};

export const changeItemQuantity = async (
  inventoryId: string,
  updatedAvailableQuantity: number,
) => {
  const supabase = await createClient();
  const { error } = await supabase
    .from('inventory_items')
    .update({ quantity_available: updatedAvailableQuantity })
    .eq('inventory_item_id', inventoryId);

  if (error) {
    throw error;
  }
};

export const deleteItem = async (inventoryId: string) => {
  const supabase = await createClient();
  const { error } = await supabase
    .from('inventory_items')
    .delete()
    .eq('inventory_item_id', inventoryId);

  if (error) {
    throw error;
  }
};
