import { createClient } from '@/app/lib/supabase/server-client';
import ItemCard from '@/app/(main)/components/ItemCard';

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
  if (storeError || !store) {
    console.error('Error fetching store:', storeError);
    return <div>Failed to load store.</div>;
  }

  const { data: itemsData, error: itemsError } = await supabase
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

  const items = itemsData?.map((item) => ({
    id: item.store_item_id as string,
    item: (item.item_name as any).name as string,
    subcategory: (item.subcategory_name as any).subcategories.name as string,
    category: (item.category_name as any)?.subcategories.categories
      .name as string,
    photoUrl: (item.item_photo_url as any)?.photo_url as string,
  }));

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
            <ItemCard
              key={item.id}
              id={item.id}
              item={item.item}
              photoUrl={item.photoUrl}
              subcategory={item.subcategory}
              category={item.category}
            />
          ))
        ) : (
          <div>No items found.</div>
        )}
      </div>
    </div>
  );
}
