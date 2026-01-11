'use server';

import {
  InventoryItem,
  InventoryItemInsert,
  Category,
  CategoryInsert,
  CategoryUpdate,
  Subcategory,
  SubcategoryInsert,
  SubcategoryUpdate,
} from '@/app/types/inventory';
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

export const updateItemQuantity = async (
  inventoryItemId: string,
  newQuantity: number,
) => {
  const supabase = await createClient();
  const { data: entry, error: err } = await supabase
    .from('inventory_items')
    .update({ quantity_available: newQuantity })
    .eq('inventory_item_id', inventoryItemId)
    .select()
    .single();

  if (err) {
    console.error('Error changing inventory item quantity:', err);
    return { success: false, data: null, error: err.message };
  }
  return { success: true, data: entry as InventoryItem };
};

export const deleteItem = async (inventoryItemId: string) => {
  const supabase = await createClient();
  const { data: entry, error: err } = await supabase
    .from('inventory_items')
    .delete()
    .eq('inventory_item_id', inventoryItemId)
    .select()
    .single();

  if (err) {
    console.error('Error deleting inventory item:', err);
    return { success: false, data: null, error: err.message };
  }
  return { success: true, data: entry as InventoryItem };
};

export const createSubcategory = async (data: SubcategoryInsert) => {
  const supabase = await createClient();
  const { data: entry, error: err } = await supabase
    .from('subcategories')
    .insert(data)
    .select()
    .single();

  if (err) {
    console.error('Error creating subcategory:', err);
    return { success: false, data: null, error: err.message };
  }
  return { success: true, data: entry as Subcategory };
};

export const updateSubcategory = async (
  subcategoryId: number,
  data: SubcategoryUpdate,
) => {
  const supabase = await createClient();
  const { data: entry, error: err } = await supabase
    .from('subcategories')
    .update(data)
    .eq('subcategory_id', subcategoryId)
    .select()
    .single();

  if (err) {
    console.error('Error updating subcategory:', err);
    return { success: false, data: null, error: err.message };
  }
  return { success: true, data: entry as Subcategory };
};

export const deleteSubcategory = async (subcategoryId: number) => {
  const supabase = await createClient();
  const { data: entry, error: err } = await supabase
    .from('subcategories')
    .delete()
    .eq('subcategory_id', subcategoryId)
    .select()
    .single();

  if (err) {
    console.error('Error deleting subcategory:', err);
    return { success: false, data: null, error: err.message };
  }
  return { success: true, data: entry as Subcategory };
};

export const createCategory = async (data: CategoryInsert) => {
  const supabase = await createClient();
  const { data: entry, error: err } = await supabase
    .from('categories')
    .insert(data)
    .select()
    .single();

  if (err) {
    console.error('Error creating category:', err);
    return { success: false, data: null, error: err.message };
  }
  return { success: true, data: entry as Category };
};

export const updateCategory = async (
  categoryId: number,
  data: CategoryUpdate,
) => {
  const supabase = await createClient();
  const { data: entry, error: err } = await supabase
    .from('categories')
    .update(data)
    .eq('category_id', categoryId)
    .select()
    .single();

  if (err) {
    console.error('Error updating category:', err);
    return { success: false, data: null, error: err.message };
  }
  return { success: true, data: entry as Category };
};

export const deleteCategory = async (categoryId: number) => {
  const supabase = await createClient();
  const { data: entry, error: err } = await supabase
    .from('categories')
    .delete()
    .eq('category_id', categoryId)
    .select()
    .single();

  if (err) {
    console.error('Error deleting category:', err);
    return { success: false, data: null, error: err.message };
  }
  return { success: true, data: entry as Category };
};
