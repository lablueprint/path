import { createClient } from '@/app/lib/supabase/server-client';
import StoresList from '@/app/(main)/components/StoresList';
import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';
import { Alert } from 'react-bootstrap';

export default async function StoreAdminsPage() {
  const supabase = await createClient();

  const { data: storesData, error: storesErr } = await supabase
    .from('stores')
    .select('*');
  if (storesErr) {
    return <Alert variant="danger">Failed to load stores.</Alert>;
  }

  const stores = storesData || [];

  return (
    <>
      <Breadcrumbs />
      <h1>Store Admins</h1>
      {stores.length > 0 ? (
        <StoresList stores={stores} />
      ) : (
        <p>No stores found.</p>
      )}
    </>
  );
}
