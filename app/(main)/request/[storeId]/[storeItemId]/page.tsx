import { createClient } from '@/app/lib/supabase/server-client';

export default async function RequestStoreItemPage({
  params,
}: {
  params: Promise<{ storeId: string; storeItemId: string }>;
}) {
  const { storeId, storeItemId } = await params;

  const supabase = await createClient();

  const { data: storeItem, error } = await supabase
    .from('store_items')
    .select(
      `
      store_item_id,
      quantity_available,
      item_name:inventory_item_id(name),
      item_description:inventory_item_id(description),
      item_photo_url:inventory_item_id(photo_url),
      subcategory_name:inventory_item_id(subcategories(name)),
      category_name:inventory_item_id(subcategories(categories(name)))
    `,
    )
    .eq('store_item_id', storeItemId)
    .single();

  if (error || !storeItem) {
    console.error('Error fetching store item:', error);
    return <div>Failed to load data.</div>;
  }

  const name = (storeItem.item_name as any)?.name;
  const description = (storeItem.item_description as any)?.description;
  const photoUrl = (storeItem.item_photo_url as any)?.photo_url;

  const subcategory = (storeItem.subcategory_name as any)?.subcategories?.name;

  const category = (storeItem.category_name as any)?.subcategories?.categories
    ?.name;

  return (
    <div>
      <h1>{name}</h1>
      <p>Description: {description ?? 'None'}</p>

      <p>Category: {category ?? 'None'}</p>

      <p>Subcategory: {subcategory ?? 'None'}</p>

      <p>Quantity available: {storeItem.quantity_available ?? 'Unknown'}</p>
    </div>
  );
}
