'use client';

import { deleteStoreItem } from '@/app/actions/store';
import { usePathname, useRouter } from 'next/navigation';
import Button from 'react-bootstrap/Button';
import styles from '@/app/(main)/manage/[storeId]/[storeItemId]/components/DeleteStoreItemButton.module.css';

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

    const targetPath = pathname.split('/').slice(0, -1).join('/') || '/';

    if (pathname === targetPath) {
      router.refresh();
      return;
    }

    router.push(targetPath);
  }

  return (
    <Button type="button" onClick={handleDelete} className={styles.button}>
      Remove item
    </Button>
  );
}
