import { User } from '@/app/types/user';

export default function UserCard({ user }: { user: User }) {
  return (
    <div>
      <h2>
        {user.first_name} {user.last_name}
      </h2>
      <a href={`mailto:${user.email}`}>
        <h3>{user.email}</h3>
      </a>
    </div>
  );
}
