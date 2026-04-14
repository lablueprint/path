import { createClient } from '@/app/lib/supabase/server-client';
import EditInventoryItemForm from './components/EditInventoryItemForm';

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
      `inventory_item_id, name, description, photo_url, subcategory_id, subcategories(category_id, name, categories(name))`,
    )
    .eq('inventory_item_id', inventoryItemId)
    .single()
    .overrideTypes<
      {
        inventory_item_id: string;
        name: string;
        description: string;
        photo_url: string | null;
        subcategory_id: number | null;
        subcategories: {
          category_id: number;
          name: string;
          categories: { name: string };
        } | null;
      },
      { merge: false }
    >();

  if (error) {
    console.error('Error fetching inventory item:', error.message);
  }

  const item = {
    inventory_item_id: data?.inventory_item_id ?? '',
    name: data?.name ?? '',
    description: data?.description ?? '',
    photo_url: data?.photo_url ?? null,
    subcategory_id: data?.subcategory_id ?? null,
  };

  const initialCategory = data?.subcategories?.category_id
    ? String(data.subcategories.category_id)
    : '';

  return (
    <div>
      <EditInventoryItemForm item={item} initialCategory={initialCategory} />
    </div>
  );
}
