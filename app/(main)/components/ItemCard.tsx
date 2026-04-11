'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/app/(main)/components/ItemCard.module.css';
import Image from 'next/image';
import defaultItemPhoto from '@/public/default-profile-picture.png';

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
    <Link className={styles['card-text']} href={`${pathname}/${id}`}>
      <div className={styles['card']}>
        <Image
          src={photoUrl || defaultItemPhoto}
          alt={item} 
          width={64}
          height={64}
          style={ {objectFit: 'cover'}}
          unoptimized
        />
        <h3>{item}</h3>
        <p>Category: {category}</p>
        <p>Subcategory: {subcategory}</p>
      </div>
    </Link>
  );
}
