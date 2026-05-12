import { createClient } from '@/app/lib/supabase/server-client';
import StoreItemsDonationForm from '@/app/(main)/manage/[storeId]/add/components/StoreItemsDonationForm';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';

export default async function AddStoreItemsPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;
  const supabase = await createClient();
  // fetch store's entry
  const { data: storeData, error: storeError } = await supabase
    .from('stores')
    .select('*')
    .eq('store_id', storeId)
    .single();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // extract user id
  const userId = user?.id;
  // fetch user's entry from users table
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (userError || storeError) return notFound();

  return (
    <div>
      <Breadcrumbs
        labelMap={{
          manage: 'Manage Inventory',
          [storeId]: storeData.name,
          add: 'Add Store Items',
        }}
      />
      <StoreItemsDonationForm store={storeData} user={userData} />
    </div>
  );
}
