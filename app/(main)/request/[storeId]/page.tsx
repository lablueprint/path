import { createClient } from '@/app/lib/supabase/server-client';
import RequestStoreItemCard from '@/app/(main)/request/components/RequestStoreItemCard';

// server component exported 
export default async function RequestStorePage({
  params,
}: {
    // takes in storeId as prop
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  //fetch store's entry in stores table (filters on store_id)
  const { data: store } = await supabase
    .from('stores')
    .select('*')
    .eq('store_id', storeId)
    .single();

// get all non-hidden store items for store
// fetch nested inventory + category data 
  const { data: storeItems } = await supabase
    .from('store_items')
    .select(
      `
        store_item_id,
        inventory_items (
          name,
          photo_url,
          subcategories (
            name,
            categories (
              name
            )
          )
        )
      `
    )
    .eq('store_id', storeId)
    .eq('hidden', false);

  return (
    // display store's name and street address
    <div>
      <h1>Store – {store.name}</h1>
      <h2>Street Address: {store.street_address}</h2>

      <h2 style={{ marginTop: '2rem' }}>Available Items</h2>
    {/* iterates through store items */}
      {storeItems && storeItems.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {storeItems.map((item) => {
            const inv = item.inventory_items?.[0];
            const subcat = inv?.subcategories?.[0];
            const category = subcat?.categories?.[0];

            return (
              <a
                key={item.store_item_id}
                // clicking card routes to /request/[storeId]/[storeItemId]
                href={`/request/${storeId}/${item.store_item_id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {/* pass each store item to a RequestItemCard component */}
                <RequestStoreItemCard
                  name={inv?.name}
                  subcategoryName={subcat?.name}
                  categoryName={category?.name}
                /> 
              </a>
            );
          })}
        </div>
      ) : (
        <h3>N/A. No items to display.</h3>
      )}

      <a href="./">
        <button>--Back--</button>
      </a>
    </div>
  );
}
