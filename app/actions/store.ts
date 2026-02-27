'use server';

import { createClient } from '@/app/lib/supabase/server-client';
import {
  Store,
  StoreInsert,
  StoreUpdate,
  StoreAdmin,
  StoreAdminInsert,
  StoreItem,
  StoreItemInsert,
} from '@/app/types/store';
import { revalidatePath } from 'next/cache';

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
    return { success: false, data: null, error: err.message };
  }
  return { success: true, data: entry as Store };
};

export const updateStore = async (storeId: string, data: StoreUpdate) => {
  const supabase = await createClient();
  const { data: entry, error: err } = await supabase
    .from('stores')
    .update(data)
    .eq('store_id', storeId)
    .select()
    .single();

  if (err) {
    console.error('Error updating store:', err);
    return { success: false, data: null, error: err.message };
  }
  return { success: true, data: entry as Store };
};

// delete store given store_id
export const deleteStore = async (storeId: string) => {
  const supabase = await createClient();
  const { data: entry, error: err } = await supabase
    .from('stores')
    .delete()
    .eq('store_id', storeId)
    .select()
    .single();

  if (err) {
    console.error('Error deleting store:', err);
    return { success: false, data: null, error: err.message };
  }
  return { success: true, data: entry as Store };
};

export const createStoreAdmin = async (data: StoreAdminInsert) => {
  const supabase = await createClient();
  const { data: entry, error: err } = await supabase
    .from('store_admins')
    .insert(data)
    .select()
    .single();

  if (err) {
    console.error('Error creating store admin:', err);
    return { success: false, data: null, error: err.message };
  }

  revalidatePath(`/team/${data.store_id}`);
  
  return { success: true, data: entry as StoreAdmin };
};

export const deleteStoreAdmin = async (storeAdminId: string) => {
  const supabase = await createClient();
  const { data: entry, error: err } = await supabase
    .from('store_admins')
    .delete()
    .eq('store_admin_id', storeAdminId)
    .select()
    .single();

  if (err) {
    console.error('Error deleting store admin:', err);
    return { success: false, data: null, error: err.message };
  }

  revalidatePath(`/team/${storeAdminId}`);

  return { success: true, data: entry as StoreAdmin };
};

export const createStoreItem = async (data: StoreItemInsert) => {
  const supabase = await createClient();
  const { data: entry, error: err } = await supabase
    .from('store_items')
    .insert(data)
    .select()
    .single();

  if (err) {
    console.error('Error creating store item:', err);
    return { success: false, data: null, error: err.message };
  }
  return { success: true, data: entry as StoreItem };
};

export const deleteStoreItem = async (storeItemId: string) => {
  const supabase = await createClient();
  const { data: entry, error: err } = await supabase
    .from('store_items')
    .delete()
    .eq('store_item_id', storeItemId)
    .select()
    .single();

  if (err) {
    console.error('Error deleting store item:', err);
    return { success: false, data: null, error: err.message };
  }
  return { success: true, data: entry as StoreItem };
};

export const updateStoreItemQuantity = async (
  storeId: string,
  storeItemId: string,
  newQuantity: number,
) => {
  const supabase = await createClient();
  const { data: entry, error: err } = await supabase
    .from('store_items')
    .update({ quantity_available: newQuantity })
    .eq('store_item_id', storeItemId)
    .select()
    .single();

  if (err) {
    console.error('Error updating store item quantity:', err);
    return { success: false, data: null, error: err.message };
  }

  revalidatePath(`/manage/${storeId}`);
  revalidatePath(`/manage/${storeId}/${storeItemId}`);
  revalidatePath(`/request/${storeId}`);
  revalidatePath(`/request/${storeId}/${storeItemId}`);

  return { success: true, data: entry as StoreItem };
};

export const updateStoreItemIsHidden = async (
  storeId: string,
  storeItemId: string,
  newIsHidden: boolean,
) => {
  const supabase = await createClient();
  const { data: entry, error: err } = await supabase
    .from('store_items')
    .update({ is_hidden: newIsHidden })
    .eq('store_item_id', storeItemId)
    .select()
    .single();

  if (err) {
    console.error('Error updating store item visibility:', err);
    return { success: false, data: null, error: err.message };
  }

  revalidatePath(`/manage/${storeId}`);
  revalidatePath(`/manage/${storeId}/${storeItemId}`);
  revalidatePath(`/request/${storeId}`);
  revalidatePath(`/request/${storeId}/${storeItemId}`);

  return { success: true, data: entry as StoreItem };
};
