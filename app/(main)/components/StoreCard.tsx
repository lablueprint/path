'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Store } from '@/app/types/store';
import styles from '@/app/(main)/components/StoreCard.module.css';
import defaultStorePhoto from '@/public/default-store-photo.png';

export default function StoreCard({ store }: { store: Store }) {
  const pathname = usePathname();

  const displayImage = store.photo_url;
  return (
    <Link className={styles.cardLink} href={`${pathname}/${store.store_id}`}>
      <div className={styles.card}>
        <Image
          src={displayImage || defaultStorePhoto.src}
          alt="Store photo"
          width={200}
          height={200}
          className={styles.cardImage}
          unoptimized
        />
        <div className={styles.cardTextWrapper}>
          <p className={styles.name}>{store.name}</p>
          <p className={styles.address}>{store.street_address}</p>
        </div>
      </div>
    </Link>
  );
}
