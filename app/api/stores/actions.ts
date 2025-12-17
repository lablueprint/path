'use server';

import { createClient } from '@/app/lib/supabase/server-client';
import { StoreInsert } from '@/app/types/store';

// create store
export const createStore = async (data: StoreInsert) => {
  const supabase = await createClient();
  const { error } = await supabase.from('stores').insert(data);
  if (error) {
    throw error;
  }
};

// action deleteStore
// delete store given store_id
export const deleteStore = async (storeId: string) => {
  const supabase = await createClient();
  const { error } = await supabase
    .from('stores')
    .delete()
    .eq('store_id', storeId);
  if (error) {
    throw error;
  }
};
