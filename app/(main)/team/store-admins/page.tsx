import { createClient } from '@/app/lib/supabase/server-client';
import StoresList from '@/app/(main)/components/StoresList';
import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';

export default async function StoreAdminsPage() {
  const supabase = await createClient();

  const { data: storesData, error: storesErr } = await supabase
    .from('stores')
    .select('*');
  if (storesErr) {
    console.error('Error fetching stores:', storesErr);
  }

  const stores = storesData || [];

  return (
    <div>
      <Breadcrumbs
        labelMap={{
          '/team': 'Team',
          '/team/store-admins': 'Store Admins',
        }}
      />
      <h1>Store Admins</h1>
      {stores.length > 0 ? (
        <StoresList stores={stores} />
      ) : (
        <p>No stores found.</p>
      )}
    </div>
  );
}
