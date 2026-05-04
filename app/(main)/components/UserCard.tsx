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
  const profilePhotoSrc =
    user.profile_photo_url?.trim() || '/image-placeholder.svg';

  return (
    <div className={cardClassName}>
      <Image
        className={styles.profilePicture}
        src={profilePhotoSrc}
        alt={`Profile picture for ${user.first_name}`}
        height={55}
        width={55}
        unoptimized
      />
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
