'use client';

import { deleteStoreItem } from '@/app/actions/store';
import { usePathname, useRouter } from 'next/navigation';

export default function DeleteStoreItemButton({
  storeItemId,
}: {
  storeItemId: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleDelete() {
    const result = await deleteStoreItem(storeItemId);

    if (!result.success) {
      console.error('Failed to delete store item:', result.error);
      return;
    }

    const targetPath = pathname.split('/').slice(0, 3).join('/');

    if (pathname === targetPath) {
      router.refresh();
      return;
    }

    router.push(targetPath);
  }

  return (
    <button type="button" onClick={handleDelete}>
      Remove item
    </button>
  );
}
