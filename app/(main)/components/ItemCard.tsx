'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/app/(main)/components/ItemCard.module.css';

type ItemCardProps = {
  id: string;
  photoUrl: string | null;
  item: string;
  subcategory: string;
  category: string;
};

export default function ItemCard({
  id,
  photoUrl: _photoUrl,
  item,
  subcategory,
  category,
}: ItemCardProps) {
  const pathname = usePathname();

  return (
    <Link className={styles.cardLink} href={`${pathname}/${id}`}>
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <div className={styles.imagePlaceholder} />
        </div>
        <div className={styles.cardBody}>
          <p className={styles.itemName}>{item}</p>
          <p className={styles.categoryText}>{category}</p>
          <p className={styles.subcategoryText}>↳ {subcategory}</p>
        </div>
      </div>
    </Link>
  );
}
