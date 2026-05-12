'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Store } from '@/app/types/store';
import styles from '@/app/(main)/components/Card.module.css';
import defaultStorePhoto from '@/public/image-placeholder.svg';

export default function StoreCard({ store }: { store: Store }) {
  const pathname = usePathname();

  const displayImage = store.photo_url;
  return (
    <Link className={styles.cardLink} href={`${pathname}/${store.store_id}`}>
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <Image
            src={displayImage || defaultStorePhoto}
            objectFit={'cover'}
            alt="Store photo"
            fill
            unoptimized
          />
        </div>
        <div className={styles.cardBody}>
          <p className={styles.name}>{store.name}</p>
          <p className={styles.cardText}>{store.street_address}</p>
        </div>
      </div>
    </Link>
  );
}
