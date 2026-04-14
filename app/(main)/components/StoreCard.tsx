'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Store } from '@/app/types/store';
import styles from '@/app/(main)/components/StoreCard.module.css';
import defaultStorePhoto from '@/public/default-store-photo.png';

export default function StoreCard({ store }: { store: Store }) {
  const pathname = usePathname();

  const displayImage = store?.photo_url;
  return (
    <Link
      className={styles['card-text']}
      href={`${pathname}/${store.store_id}`}
    >
      <div className={styles['card']}>
        <Image
          src={displayImage ?? defaultStorePhoto.src}
          alt="Profile photo"
          width={64}
          height={64}
          style={{ objectFit: 'cover' }}
          unoptimized
        />
        <h2>{store.name}</h2>
        <p>{store.street_address}</p>
      </div>
    </Link>
  );
}
