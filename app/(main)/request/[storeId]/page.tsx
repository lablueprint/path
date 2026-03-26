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
        inventory_items(name, photo_url, subcategories(name, categories(name)))
      `,
    )
    .eq('store_id', storeId)
    .eq('is_hidden', false)
    .overrideTypes<
      {
        store_item_id: string;
        inventory_items: {
          name: string;
          photo_url: string;
          subcategories: {
            name: string;
            categories: {
              name: string;
            };
          };
        };
      }[],
      { merge: false }
    >();

  if (itemsError) {
    console.error('Error fetching store items:', itemsError);
    return <div>Failed to load store items.</div>;
  }

  const items = itemsData?.map((item) => ({
    id: item.store_item_id,
    item: item.inventory_items.name,
    subcategory: item.inventory_items.subcategories.name,
    category: item.inventory_items.subcategories.categories.name,
    photoUrl: item.inventory_items.photo_url,
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
