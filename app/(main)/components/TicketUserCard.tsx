import { User } from '@/app/types/user';
import styles from '@/app/(main)/components/TicketUserCard.module.css';
import Image from 'next/image';
import imagePlaceholder from '@/public/image-placeholder.svg';

export default function TicketUserCard({
  user
}: {
  user: User;
  className?: string;
}) {
  const cardClassName = [
    styles.userCard,
  ]
    .filter(Boolean)
    .join(' ');
  const profilePhotoSrc = user.profile_photo_url?.trim() || imagePlaceholder;

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
