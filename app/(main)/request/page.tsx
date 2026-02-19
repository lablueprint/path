import { createClient } from '@/app/lib/supabase/server-client';
import StoresList from '@/app/components/StoresList';

const supabase = await createClient();

export default async function RequestPage() {
  // get all stores from the stores table
  const { data: storesData, error: err } = await supabase
    .from('stores')
    .select('store_id, name, street_address');

  if (err) {
    console.error('Error fetching stores:', err);
  }

  const stores = storesData || [];

  return (
    <div>
      <h1>Request Inventory</h1>
      {stores.length > 0 ? (
        <StoresList stores={stores} />
      ) : (
        <p>No stores found.</p>
      )}
    </div>
  );
}
