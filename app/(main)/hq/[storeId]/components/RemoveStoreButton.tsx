'use client';

import { useRouter } from 'next/navigation';
import { deleteStore } from '../../../../actions/store';
import { createClient } from '@/app/lib/supabase/browser-client';

type RemoveStoreButtonProp = {
  storeId: string;
};

export function RemoveStoreButton({ storeId }: RemoveStoreButtonProp) {
  const router = useRouter();
  const supabase = createClient();

  const handleDeletion = async () => {
    // Remove photo from bucket first
    await supabase.storage
      .from('store_photos')
      .remove([`${storeId}/profile.jpg`]);
    const { success, error } = await deleteStore(storeId);
    if (!success) {
      alert('Failed to remove store.');
      console.error(error);
    } else {
      router.push('/hq');
    }
  };

  return (
    <button type="button" onClick={handleDeletion}>
      Remove store
    </button>
  );
}
