import { createClient } from '@/app/lib/supabase/server-client';
import type { Store } from '@/app/types/store';
import EditStoreForm from '@/app/(main)/administration/stores/[storeId]/components/EditStoreForm';
import RemoveStoreButton from '@/app/(main)/administration/stores/[storeId]/components/RemoveStoreButton';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';
import Image from 'next/image';
import pinIcon from '@/public/pin-icon.svg';

export default async function StoreDetailsPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;

  const supabase = await createClient();
  const { data: storeData, error: storeError } = await supabase
    .from('stores')
    .select('store_id, name, street_address, photo_url')
    .eq('store_id', storeId)
    .single();

  if (!storeData) {
    notFound();
  }

  if (storeError) {
    console.error('Error fetching store:', storeError);
    return <div>Failed to load store.</div>;
  }

  const store = storeData as Store;

  return (
    <>
      <Breadcrumbs
        labelMap={{
          [`/administration/stores/${store.store_id}`]: `${store.name}`,
        }}
      />
      <h1>
        <span>{store.name} </span>
        <Image src={pinIcon} height={32} alt="Pin icon" />
      </h1>
      <EditStoreForm store={store} />
      <div>
        <RemoveStoreButton storeId={store.store_id} />
      </div>
    </>
  );
}
