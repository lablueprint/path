import { createClient } from '@/app/lib/supabase/server-client';
import type { Store } from '@/app/types/store';
import { EditStoreForm } from './components/EditStoreForm';
import { RemoveStoreButton } from './components/RemoveStoreButton';
import { notFound } from 'next/navigation';

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
    <div>
      <h1>{store.name}</h1>
      <EditStoreForm store={store} />
      <RemoveStoreButton storeId={store.store_id} />
    </div>
  );
}
