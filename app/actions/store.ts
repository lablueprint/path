'use server';

import { createClient } from '@/app/lib/supabase/server-client';
import { StoreInsert } from '@/app/types/store';

// create store
export const createStore = async (data: StoreInsert) => {
  const supabase = await createClient();
  const { data: entry, error: err } = await supabase
    .from('stores')
    .insert(data)
    .select()
    .single();

  if (err) {
    console.error('Error creating store:', err);
    return { success: false, error: err.message };
  }
  return { success: true, data: entry };
};

// delete store given store_id
export const deleteStore = async (storeId: string) => {
  const supabase = await createClient();
  const { error: err } = await supabase
    .from('stores')
    .delete()
    .eq('store_id', storeId);

  if (err) {
    console.error('Error deleting store:', err);
    return { success: false, error: err.message };
  }
  return { success: true };
};
