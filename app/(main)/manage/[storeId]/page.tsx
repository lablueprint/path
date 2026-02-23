import { createClient } from '@/app/lib/supabase/server-client';
import ManageStoreItemCard from '@/app/(main)/manage/[storeId]/components/ManageStoreItemCard';

export default async function ManageStorePage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;

  // fetching data for store associated with storeId
  const supabase = await createClient();
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('*')
    .eq('store_id', storeId)
    .single();
  if (storeError) {
    console.error('Error fetching store:', storeError);
    return <div>Failed to load store.</div>;
  }

  const { data: items, error: itemsError } = await supabase
    .from('store_items')
    .select(
      `
        store_item_id,
        item_name:inventory_item_id(name),
        item_photo_url:inventory_item_id(photo_url),
        subcategory_name:inventory_items(subcategories(name)),
        category_name:inventory_items(subcategories(categories(name)))
      `,
    )
    .eq('store_id', storeId);
  if (itemsError) {
    console.error('Error fetching store items:', itemsError);
    return <div>Failed to load store items.</div>;
  }

  return (
    <div>
      {/* store info */}
      <div>
        <h1>{store.name}</h1>
        <p>{store.street_address}</p>
      </div>
      {/* store items + info */}
      <div>
        <h2>Items</h2>
        {items?.length ? (
          items.map((item) => (
            <ManageStoreItemCard
              key={item.store_item_id}
              item={item}
              storeId={storeId}
            />
          ))
        ) : (
          <div>No items found.</div>
        )}
      </div>
    </div>
  );
}
