'use server';

import { createClient } from '@/app/lib/supabase/server-client';
import { StoreInsert } from '@/app/types/Store';

// create store
export const createStore = async (data: StoreInsert) => {
  const supabase = await createClient();
  const { data: entry, error } = await supabase.from('stores').insert(data);
  if (error) {
    throw error;
  }
  return entry;
};

// action deleteStore
// delete store given store_id
export const deleteStore = async (store_id: string) => {
  const supabase = await createClient();
  const { data: deletedData, error } = await supabase
    .from('stores')
    .delete()
    .eq('store_id', store_id);
  if (error) {
    throw error;
  }
  return deletedData;
};
