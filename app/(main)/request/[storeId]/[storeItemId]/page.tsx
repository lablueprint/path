import { createClient } from '@/app/lib/supabase/server-client';
import AddInStockToCartForm from '@/app/(main)/request/[storeId]/[storeItemId]/components/AddInStockToCartForm';

export default async function RequestStoreItemPage({
  params,
}: {
  params: Promise<{ storeId: string; storeItemId: string }>;
}) {
  const { storeId, storeItemId } = await params;

  const supabase = await createClient();

  const [{ data: itemData, error: itemError }, { data: storeData, error: storeError }] =
    await Promise.all([
      supabase
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
              photo_url: string | null;
              subcategories: {
                name: string;
                categories: {
                  name: string;
                };
              };
            };
          },
          { merge: false }
        >(),
      supabase
        .from('stores')
        .select('name')
        .eq('store_id', storeId)
        .single()
        .overrideTypes<{ name: string }, { merge: false }>(),
    ]);

  if (itemError || !itemData || storeError || !storeData) {
    console.error('Error fetching request page data:', itemError || storeError);
    return <div>Failed to load data.</div>;
  }

  return (
    <div>
      <AddInStockToCartForm
        storeId={storeId}
        storeItemId={storeItemId}
        storeName={storeData.name}
        itemName={itemData.inventory_items.name}
        categoryName={itemData.inventory_items.subcategories.categories.name}
        subcategoryName={itemData.inventory_items.subcategories.name}
        description={itemData.inventory_items.description}
        photoUrl={itemData.inventory_items.photo_url}
        quantityAvailable={itemData.quantity_available}
      />
    </div>
  );
}
