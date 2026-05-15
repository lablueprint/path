'use client';

import { useRouter } from 'next/navigation';
import { deleteStore } from '@/app/actions/store';
import { createClient } from '@/app/lib/supabase/browser-client';

type RemoveStoreButtonProp = {
  storeId: string;
};

export default function RemoveStoreButton({ storeId }: RemoveStoreButtonProp) {
  const router = useRouter();
  const supabase = createClient();

  const handleDeletion = async () => {
    // Remove photo from bucket first
    const { error: storageError } = await supabase.storage
      .from('store_photos')
      .remove([`${storeId}/store.jpg`]);
    const { success, error } = await deleteStore(storeId);
    if (storageError || !success) {
      alert('Failed to remove store.');
      console.error(error);
    } else {
      router.push('/hq');
    }
  };

  return (
    <button
      type="button"
      onClick={handleDeletion}
      className="btn-remove"
      style={{ marginTop: 20 }}
    >
      Remove store
    </button>
  );
}
