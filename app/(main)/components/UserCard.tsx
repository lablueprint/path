import { User } from '@/app/types/user';
import styles from '@/app/(main)/components/UserCard.module.css';
import Image from 'next/image';

export default function UserCard({ user }: { user: User }) {
  return (
    <div className={styles['card']}>
      <Image src={user.profile_photo_url ? user.profile_photo_url : '/default-profile-picture.png'} alt={`Profile picture for ${user.first_name}`} height={100} width={100} />
      <h3>
        {user.first_name} {user.last_name}
      </h3>
      <a
        href={`mailto:${user.email}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <h3>{user.email}</h3>
      </a>
    </div>
  );
}
