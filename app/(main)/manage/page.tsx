import { createClient } from '@/app/lib/supabase/server-client';
import StoresList from '@/app/(main)/components/StoresList';
import { Store } from '@/app/types/store';
import Link from 'next/link';
import { Alert } from 'react-bootstrap';

export default async function ManagePage() {
  const supabase = await createClient();

  // get user's claims
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError) {
    return <Alert variant="danger">Failed to load user.</Alert>;
  }

  const userRole = claimsData?.claims?.user_role;
  const userId = claimsData?.claims?.sub;

  let stores: Store[] = [];

  // if user's role is "superadmin" or "owner" get all stores from stores table
  if (userRole === 'superadmin' || userRole === 'owner') {
    const { data, error } = await supabase.from('stores').select('*');

    if (error) {
      return <Alert variant="danger">Failed to load stores.</Alert>;
    }

    stores = data as Store[];
  } else {
    const { data, error } = await supabase
      .from('store_admins')
      .select('stores(*)')
      .eq('user_id', userId)
      .overrideTypes<
        {
          stores: Store | null;
        }[],
        { merge: false }
      >();

    if (error) {
      return <Alert variant="danger">Failed to load stores.</Alert>;
    }

    stores = (data ?? []).map((row) => row.stores as Store);
  }
  return (
    <>
      <h1>Manage Inventory</h1>
      <span className="link-btn-row">
        <Link className="link-btn" href="/manage/inventory">
          Inventory Library
        </Link>
        <Link className="link-btn" href="/manage/categories">
          Item Categories
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
