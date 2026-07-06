import { createClient } from '@/app/lib/supabase/server-client';
import StoresList from '@/app/(main)/components/StoresList';
import AddStoreForm from '@/app/(main)/administration/stores/components/AddStoreForm';
import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';

export default async function StoresPage() {
  const supabase = await createClient();

  const { data: storesData, error: storesErr } = await supabase
    .from('stores')
    .select('store_id, name, street_address, photo_url');

  if (storesErr) {
    console.error('Error fetching stores:', storesErr);
  }

  const stores = storesData || [];

  return (
    <>
      <Breadcrumbs />
      <h1>Stores</h1>
      <h2>Add Store</h2>
      <AddStoreForm />
      <h2>Edit Stores</h2>
      {stores.length > 0 ? (
        <StoresList stores={stores} />
      ) : (
        <p>No stores found.</p>
      )}
    </>
  );
}
