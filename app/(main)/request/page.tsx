import { createClient } from '@/app/lib/supabase/server-client';
import StoresList from '@/app/components/StoresList';

const supabase = await createClient();

export default async function RequestPage() {
  // get all stores from the stores table
  const { data: stores, error: err } = await supabase
    .from('stores')
    .select('store_id, name, street_address');

  if (err) {
    console.error('Error fetching stores:', err);
  }

  return (
    <div>
      <h1>Request Inventory</h1>
      <StoresList stores={stores || []} />
    </div>
  );
}
