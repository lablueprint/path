import { createClient } from '@/app/lib/supabase/server-client';
import ManageStoreItemCard from '../components/ManageStoreItemCard';

export default async function ManageStorePage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;

  // fetching data for store associated with storeId
  const supabase = await createClient();
  const { data: store, error: id_error } = await supabase
    .from('stores')
    .select('*')
    .eq('store_id', storeId)
    .single();
  if (id_error) {
    console.error('Error fetching store:', id_error);
    return <div>Failed to load store data.</div>;
  }

  const { data: items, error: items_error } = await supabase
    .from('store_items')
    .select(
      `
        store_item_id,
        item_name:inventory_item_id(name),
        item_photo_url:inventory_item_id(photo_url),
        subcategory_name:inventory_items(subcategories(name)),
        category_name:inventory_items(subcategories(categories(name)))
      `
    )
    .eq('store_id', storeId);
  if (items_error) {
    console.error('Error fetching store items:', items_error);
    return <div>Failed to load store items.</div>;
  }

  return (
    <div>
      {/* store info */}
      <div>
        <h1>Store Info</h1>
        <h3>Store ID: {storeId}</h3>
        <h3>Store Name: {store.name}</h3>
        <h3>Store Address: {store.street_address}</h3>
      </div>

      {/* store items + info */}
      <div>
        <h1>Store Items:</h1>
        {(items ?? []).map((item) => (
          <ManageStoreItemCard 
            key={item.store_item_id} 
            item={item} 
            storeId={storeId}
          />
        ))}
      </div>
    </div>
  );
}
