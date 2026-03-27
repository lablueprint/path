import { createClient } from '@/app/lib/supabase/server-client';

export default async function RequestStoreItemPage({
  params,
}: {
  params: Promise<{ storeId: string; storeItemId: string }>;
}) {
  const { storeItemId } = await params;

  const supabase = await createClient();

  const { data: itemData, error } = await supabase
    .from('store_items')
    .select(
      `
        store_item_id,
        quantity_available,
        inventory_items(name, description, photo_url,
          subcategories(name,
              categories(name)
          )
        )
      `,
    )
    .eq('store_item_id', storeItemId)
    .single()
    .overrideTypes<
      {
        store_item_id: string;
        quantity_available: number;
        inventory_items: {
          name: string;
          description: string;
          photo_url: string;
          subcategories: {
            name: string;
            categories: {
              name: string;
            };
          };
        };
      },
      { merge: false }
    >();

  if (error || !itemData) {
    console.error('Error fetching store item:', error);
    return <div>Failed to load data.</div>;
  }

  return (
    <div>
      <h1>{itemData.inventory_items.name}</h1>
      <p>Description: {itemData.inventory_items.description}</p>
      <p>Category: {itemData.inventory_items.subcategories.categories.name}</p>
      <p>Subcategory: {itemData.inventory_items.subcategories.name}</p>
      <p>Quantity available: {itemData.quantity_available}</p>
    </div>
  );
}
