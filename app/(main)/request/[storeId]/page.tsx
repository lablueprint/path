import { createClient } from '@/app/lib/supabase/server-client';
import ItemCard from '@/app/(main)/components/ItemCard';

export default async function RequestStorePage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;

  const supabase = await createClient();

  // Fetch store
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('*')
    .eq('store_id', storeId)
    .single();

  if (storeError || !store) {
    console.error('Error fetching store:', storeError);
    return <div>Failed to load store.</div>;
  }

  // Fetch non-hidden store items
  const { data: itemsData, error: itemsError } = await supabase
    .from('store_items')
    .select(
      `
      store_item_id,
      item_name:inventory_item_id(name),
      item_photo_url:inventory_item_id(photo_url),
      subcategory_name:inventory_item_id(subcategories(name)),
      category_name:inventory_item_id(subcategories(categories(name)))
    `,
    )
    .eq('store_id', storeId)
    .eq('is_hidden', false);

  if (itemsError) {
    console.error('Error fetching store items:', itemsError);
    return <div>Failed to load store items.</div>;
  }

  const items = itemsData?.map((item) => ({
    id: item.store_item_id as string,
    item: (item.item_name as any)?.name as string,
    subcategory: (item.subcategory_name as any)?.subcategories?.name as string,
    category: (item.category_name as any)?.subcategories?.categories
      ?.name as string,
    photoUrl: (item.item_photo_url as any)?.photo_url as string,
  }));

  return (
    <div>
      <div>
        <h1>{store.name}</h1>
        <p>{store.street_address}</p>
      </div>

      <h2>Available Items</h2>

      {items && items.length > 0 ? (
        <div>
          {items.map((item) => (
            <ItemCard
              key={item.id}
              id={item.id}
              item={item.item}
              subcategory={item.subcategory}
              category={item.category}
              photoUrl={item.photoUrl}
            />
          ))}
        </div>
      ) : (
        <h3>No available items found.</h3>
      )}
    </div>
  );
}
