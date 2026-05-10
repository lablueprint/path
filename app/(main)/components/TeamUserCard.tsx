'use client';
import { User } from '@/app/types/user';
import styles from '@/app/(main)/components/Card.module.css';
import Image from 'next/image';
import imagePlaceholder from '@/public/image-placeholder.svg';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TeamUserCard({
  user,
}: {
  user: User;
  noBottomMargin?: boolean;
  className?: string;
}) {
  const pathname = usePathname();
  const displayImage = user.profile_photo_url;

  return (
    <Link className={styles.cardLink} href={`${pathname}/${user.user_id}`}>
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <Image
            src={displayImage || imagePlaceholder}
            alt={`Profile picture for ${user.first_name}`}
            fill
            unoptimized
          />
        </div>
        <div className={styles.cardBody}>
          <p className={styles.name}>
            {user.first_name} {user.last_name}
          </p>
          <a
            className={styles.emailLink}
            href={`mailto:${user.email}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={styles.cardText}>{user.email}</span>
          </a>
        </div>
      </div>
    </Link>
  );
}
