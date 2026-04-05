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
    .single()
    .overrideTypes<
      {
        inventory_item_id: string;
        name: string;
        description: string;
        photo_url: string;
        subcategories: {
          name: string;
          categories: {
            name: string;
          };
        };
      },
      { merge: false }
    >();
  if (error) {
    console.error('Error fetching inventory item:', error.message);
  }

  const item = {
    inventory_item_id: data?.inventory_item_id,
    item: data?.name,
    description: data?.description,
    photo_url: data?.photo_url,
    subcategory: data?.subcategories.name,
    category: data?.subcategories.categories.name,
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
