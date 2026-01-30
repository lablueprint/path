import { createClient } from '@/app/lib/supabase/server-client';
// exports server component RequestStoreItemPage
export default async function RequestStoreItemPage({
  params,
}: {
  params: Promise<{ storeId: string; storeItemId: string }>;
}) {
  const { storeId, storeItemId } = await params; // page takes storeId and storeItemId as props

  const supabase = await createClient();

  // select store_item_id and quantity_available from store_items
  // select name, description, and photo_url from inventory_items
  // select subcategories.name and categories.name
  const { data: storeItem, error: itemError } = await supabase
    .from('store_items')
    .select(
      `
        store_item_id,
        quantity_available,
        inventory_items (
          name,
          description,
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
    // match storeItemId
    .eq('store_item_id', storeItemId)
    .single();

  if (itemError) {
    console.error('Error fetching store item:', itemError);
    return <div>Failed to load data.</div>;
  }
// extract nested values:  name description, category, subcategory
  const inv = storeItem.inventory_items?.[0];
  const subcat = inv?.subcategories?.[0];
  const category = subcat?.categories?.[0];

  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '1rem',
        borderRadius: '8px',
        width: '350px',
      }}
    >
      <h1>Request Item Details</h1>
      {/* display inventory item name  */}
      <h2>{inv?.name}</h2> 

      {inv?.photo_url && (
        <img
          src={inv.photo_url}
          alt={inv?.name}
          width="200"
          style={{ borderRadius: '6px', marginBottom: '1rem' }}
        />
      )}

{/* Display inventory item description */}
      <p>
        <strong>Description:</strong>{' '}
        {inv?.description ?? 'No description available'}
      </p>

{/* display category name */}
      <p>
        <strong>Category:</strong> {category?.name ?? 'None'}
      </p>

{/* display subcategory name */}
      <p>
        <strong>Subcategory:</strong> {subcat?.name ?? 'None'}
      </p>

{/* display quantity available  */}
      <p>
        <strong>Quantity Available:</strong>{' '}
        {storeItem.quantity_available ?? 'Unknown'}
      </p>

      <a href={`/request/${storeId}`}>
        <button>--Back--</button>
      </a>
    </div>
  );
}
