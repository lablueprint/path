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
  photoUrl,
  item,
  subcategory,
  category,
}: ItemCardProps) {
  const pathname = usePathname();
  return (
    <Link className={styles.cardText} href={`${pathname}/${id}`}>
      <div className={styles.card}>
        <h3>{item}</h3>
        {photoUrl ? <p>Photo URL: {photoUrl}</p> : null}
        <p>Category: {category}</p>
        <p>Subcategory: {subcategory}</p>
      </div>
    </Link>
  );
}
