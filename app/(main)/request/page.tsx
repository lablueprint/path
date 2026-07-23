import { createClient } from '@/app/lib/supabase/server-client';
import StoresList from '@/app/(main)/components/StoresList';
import Link from 'next/link';
import { Alert } from 'react-bootstrap';

export default async function RequestPage() {
  const supabase = await createClient();
  // get all stores from the stores table
  const { data: storesData, error: err } = await supabase
    .from('stores')
    .select('*');

  if (err) {
    return <Alert variant="danger">Failed to load stores.</Alert>;
  }

  const stores = storesData || [];

  return (
    <>
      <h1>Request Inventory</h1>
      <span className="link-btn-row">
        <Link className="link-btn" href="/request/all">
          All Stores
        </Link>
      </span>
      {stores.length > 0 ? (
        <StoresList stores={stores} />
      ) : (
        <p>No stores found.</p>
      )}
    </>
  );
}
