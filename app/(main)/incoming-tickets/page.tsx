import { createClient } from '@/app/lib/supabase/server-client';
import StoresList from '@/app/(main)/components/StoresList';
import { Store } from '@/app/types/store';

export default async function IncomingTicketsStoresPage() {
  const supabase = await createClient();

  // Get user's claims
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError) {
    console.error('Error fetching claims data:', claimsError);
  }

  const userRole = claimsData?.claims?.user_role;
  const userId = claimsData?.claims?.sub;
  let stores: Store[] = [];

  // If user's role is "superadmin" or "owner" get all stores from stores table
  if (userRole === 'superadmin' || userRole === 'owner') {
    const { data, error } = await supabase.from('stores').select('*');

    if (error) {
      console.error('Error fetching stores:', error);
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
      console.error('Error fetching stores:', error);
    }
    stores = (data ?? []).map((row) => row.stores as Store);
  }
  return (
    <div>
      <h1>Incoming Tickets</h1>
      {stores.length > 0 ? (
        <StoresList stores={stores} />
      ) : (
        <p>No stores found.</p>
      )}
    </div>
  );
}