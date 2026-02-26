import { User } from '@/app/types/user';
import styles from '@/app/(main)/components/UserCard.module.css';

export default function UserCard({ user }: { user: User }) {
  return (
    <div className={styles['card']}>
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
