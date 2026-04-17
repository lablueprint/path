'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Store } from '@/app/types/store';
import styles from '@/app/(main)/components/StoreCard.module.css';

export default function StoreCard({ store }: { store: Store }) {
  const pathname = usePathname();

  return (
    <Link className={styles.cardText} href={`${pathname}/${store.store_id}`}>
      <div className={styles.card}>
        <h2>{store.name}</h2>
        <p>{store.street_address}</p>
      </div>
    </Link>
  );
}
