import { createClient } from '@/app/lib/supabase/server-client';
import AddAdminSearch from '@/app/(main)/administration/store-admins/[storeId]/components/AddAdminSearch';
import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';
import AddAdminCard from '@/app/(main)/administration/store-admins/[storeId]/components/AddAdminCard';
import Image from 'next/image';
import pinIcon from '@/public/pin-icon.svg';

export default async function StoreAdminPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;

  const supabase = await createClient();
  const { data: store_data, error: store_error } = await supabase
    .from('stores')
    .select(
      `
        name,
        street_address
      `,
    )
    .eq('store_id', storeId)
    .single();
  if (store_error) {
    console.error('Error fetching store information:', store_error);
    return <div>Failed to load store data.</div>;
  }

  // get user's claims
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  if (claimsError) {
    console.error('Error fetching claims data:', claimsError);
  }

  const userRole = claimsData?.claims?.user_role;
  const userId = claimsData?.claims?.sub;

  // check if the user is the store's admin, superadmin, or owner
  const { data: admin } = await supabase
    .from('store_admins')
    .select('')
    .eq('store_id', storeId)
    .eq('user_id', userId)
    .maybeSingle();
  const canChangeAdmins =
    !!admin || userRole === 'superadmin' || userRole === 'owner';

  const { data: admins, error: adminsError } = await supabase
    .from('store_admins')
    .select(
      `
        store_admin_id,
        user_id,
        users(*)
      `,
    )
    .eq('store_id', storeId)
    .overrideTypes<
      {
        store_admin_id: string;
        user_id: string;
        users: {
          user_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          profile_photo_url: string | null;
        };
      }[],
      { merge: false }
    >();
  if (adminsError) {
    console.error('Error fetching store admins:', adminsError);
    return <div>Failed to load store admins.</div>;
  }
  const existingAdminUserIds = admins?.map((admin) => admin.user_id);

  return (
    <>
      <Breadcrumbs
        labelMap={{
          [`/administration/store-admins/${storeId}`]:
            store_data?.name ?? 'Store',
        }}
      />
      <h1>
        <span>Admins for {store_data.name} </span>
        <Image src={pinIcon} height={32} alt="Pin icon" />
      </h1>

      {/* searching store admins (AddAdminSearch) if eligible role */}
      {canChangeAdmins && (
        <>
          <h2>Add Admin</h2>
          <AddAdminSearch
            storeId={storeId}
            existingAdminUserIds={existingAdminUserIds ?? []}
          />
        </>
      )}

      {/* viewing store admins */}
      <h2>Current Admins</h2>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-5">
        {admins?.length ? (
          admins.map((admin) => {
            const user = admin.users;
            return (
              <div key={admin.store_admin_id} className="col">
                <AddAdminCard
                  user={user}
                  showRemove={canChangeAdmins}
                  storeAdminId={admin.store_admin_id}
                ></AddAdminCard>
              </div>
            );
          })
        ) : (
          <div>No admins found.</div>
        )}
      </div>
    </>
  );
}
