import { createClient } from '@/app/lib/supabase/server-client';
import type { Store } from '@/app/types/store';
import EditStoreForm from '@/app/(main)/administration/stores/[storeId]/components/EditStoreForm';
import RemoveStoreButton from '@/app/(main)/administration/stores/[storeId]/components/RemoveStoreButton';
import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';
import Image from 'next/image';
import pinIcon from '@/public/pin-icon.svg';
import { Alert } from 'react-bootstrap';

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

  if (!storeData || storeError) {
    return <Alert variant="danger">Failed to load store.</Alert>;
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
      <RemoveStoreButton storeId={store.store_id} />
    </>
  );
}
