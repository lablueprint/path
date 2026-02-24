import { User } from '@/app/types/user';

export default function UserCard({ user }: { user: User }) {
  return (
    <div style={{ border: "2px solid black", borderRadius: "5px", backgroundColor: "#ccc", margin: "5px", padding: "5px" }}>
      <h3>
        {user.first_name} {user.last_name}
      </h3>
      <a href={`mailto:${user.email}`}>
        <h3>{user.email}</h3>
      </a>
    </div>
  );
}
