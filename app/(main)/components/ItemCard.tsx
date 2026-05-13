'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/app/(main)/components/Card.module.css';
import Image from 'next/image';
import defaultItemPhoto from '@/public/image-placeholder.svg';

type ItemCardProps = {
  id: string;
  photoUrl: string | null;
  item: string;
  subcategory: string;
  category: string;
};

export default function ItemCard({
  id,
  photoUrl,
  item,
  subcategory,
  category,
}: ItemCardProps) {
  const pathname = usePathname();

  return (
    <Link className={styles.cardLink} href={`${pathname}/${id}`}>
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <Image
            src={photoUrl || defaultItemPhoto}
            objectFit={'cover'}
            alt="Item photo"
            fill
            unoptimized
          />
        </div>
        <div className={styles.cardBody}>
          <p className={styles.name}>{item}</p>
          <p className={styles.cardText}>{category}</p>
          <p className={styles.cardText}>↳ {subcategory}</p>
        </div>
      </div>
    </Link>
  );
}
