import { User } from '@/app/types/user';
import styles from '@/app/(main)/components/UserCard.module.css';
import Image from 'next/image';

export default function UserCard({
  user,
  noBottomMargin = false,
  className,
}: {
  user: User;
  noBottomMargin?: boolean;
  className?: string;
}) {
  const cardClassName = [
    styles.userCard,
    noBottomMargin ? styles.noBottomMargin : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  const hasProfilePhoto = Boolean(user.profile_photo_url);

  return (
    <div className={cardClassName}>
      {hasProfilePhoto ? (
        <Image
          className={styles.profilePicture}
          src={user.profile_photo_url as string}
          alt={`Profile picture for ${user.first_name}`}
          height={55}
          width={55}
          unoptimized
        />
      ) : (
        <div
          className={styles.profilePicturePlaceholder}
          role="img"
          aria-label={`Profile picture placeholder for ${user.first_name}`}
        />
      )}
      <div className={styles.userText}>
        <h3 className={styles.userName}>
          {user.first_name} {user.last_name}
        </h3>
        <a
          className={styles.emailLink}
          href={`mailto:${user.email}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className={styles.userEmail}>{user.email}</span>
        </a>
      </div>
    </div>
  );
}
