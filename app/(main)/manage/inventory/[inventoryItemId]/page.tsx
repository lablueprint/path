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
      `inventory_item_id, name, description, photo_url, subcategories(name, categories(name))`,
    )
    .eq('inventory_item_id', inventoryItemId)
    .single();
  if (error) {
    console.error('Error fetching inventory items info: ', error.message);
  }

  const item = {
    inventory_item_id: data?.inventory_item_id as string,
    item: data?.name as string,
    description: data?.description as string,
    photo_url: data?.photo_url as string,
    subcategory: (data?.subcategories as any).name as string,
    category: (data?.subcategories as any).categories.name as string,
  };

  return (
    <div>
      <h1>{item.item}</h1>
      <p>Description: {item.description}</p>
      <p>Category: {item.category}</p>
      <p>Subcategory: {item.subcategory}</p>
    </div>
  );
}
