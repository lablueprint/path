'use client';

import { useRouter } from 'next/navigation';
import { deleteStore } from '@/app/actions/store';

type RemoveStoreButtonProp = {
  storeId: string;
};

export default function RemoveStoreButton({ storeId }: RemoveStoreButtonProp) {
  const router = useRouter();
  const handleDeletion = async () => {
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
