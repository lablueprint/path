import { User } from '@/app/types/user';
import styles from '@/app/(main)/components/TicketUserCard.module.css';
import ticketStyles from '@/app/(main)/components/Card.module.css';
import Image from 'next/image';
import imagePlaceholder from '@/public/image-placeholder.svg';

export default function TicketUserCard({
  user,
}: {
  user: User;
  className?: string;
}) {
  const profilePhotoSrc = user.profile_photo_url?.trim() || imagePlaceholder;

  return (
    <div className={styles.admin}>
      <Image
        className={styles.profilePicture}
        src={profilePhotoSrc}
        alt={user.first_name + ' ' + user.last_name}
        height={48}
        width={48}
        unoptimized
      />
      <div className={`justify-content-center ${ticketStyles.cardTextGroup}`}>
        <h3 className={ticketStyles.name}>
          {user.first_name} {user.last_name}
        </h3>
        <a
          href={`mailto:${user.email}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {user.email}
        </a>
      </div>
    </div>
  );
}
