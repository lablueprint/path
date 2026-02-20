'use server';
import { createClient } from '@/app/lib/supabase/server-client';

export default async function InventoryItemPage({
  params,
}: {
  params: Promise<{ inventoryItemId: string }>;
}) {
  const { inventoryItemId } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('inventory_items')
    .select(
      `inventory_item_id, name, description, photo_url, subcategories(name), categories(name)`,
    )
    .eq('inventory_item_id', inventoryItemId)
    .single();
  if (error) {
    console.log('Error fetching inventory items info: ', error.message);
  }
  if (data) {
    console.log('sub, cat');
    console.log(data.subcategories);
    console.log(data.categories);
  }
  return (
    <div>
      <p>{data?.name}</p>
      <p>{data?.description}</p>
      <p>{data?.subcategories?.name}</p>
      <p>{data?.categories?.name}</p>
    </div>
  );
}
