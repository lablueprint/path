import { createClient } from '@/app/lib/supabase/server-client';
import RequestStoreItemCard from '@/app/(main)/request/components/RequestStoreItemCard';

export default async function RequestStorePage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: store } = await supabase
    .from('stores')
    .select('*')
    .eq('store_id', storeId)
    .single();

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
    <div>
      <h1>Store – {store.name}</h1>
      <h2>Street Address: {store.street_address}</h2>

      <h2 style={{ marginTop: '2rem' }}>Available Items</h2>

      {storeItems && storeItems.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {storeItems.map((item) => {
            const inv = item.inventory_items?.[0];
            const subcat = inv?.subcategories?.[0];
            const category = subcat?.categories?.[0];

            return (
              <a
                key={item.store_item_id}
                href={`/request/${storeId}/${item.store_item_id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
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
        <h3>No items available.</h3>
      )}

      <a href="./">
        <button>--Back--</button>
      </a>
    </div>
  );
}
