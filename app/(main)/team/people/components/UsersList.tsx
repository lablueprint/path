import Link from 'next/link';
import Image from 'next/image';

export default function UsersList({
  users,
}: {
  users: {
    user_id: string;
    first_name: string;
    last_name: string;
    role: string;
    email: string;
    profile_photo_url: string | null;
  }[];
}) {
  return (
    <div>
      <table
        style={{
          width: '100%',
          tableLayout: 'fixed',
          borderCollapse: 'collapse',
          border: '1px solid #d1d5db',
        }}
      >
        <thead>
          <tr>
            <th style={{ width: '30%' }}>Name</th>
            <th style={{ width: '20%' }}>Email</th>
            <th style={{ width: '30%' }}>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id} style={{ border: '1px solid #d1d5db' }}>
              <td>
                <Image
                  src={user.profile_photo_url || '/default-profile-picture.png'}
                  alt={`Profile picture for ${user.first_name}`}
                  height={32}
                  width={32}
                  style={{ marginRight: '10px' }}
                  unoptimized
                />
                <Link
                  key={user.user_id}
                  href={`/team/people/${user.user_id}`} // Where to navigate
                >
                  {user.first_name + ' ' + user.last_name}
                </Link>
              </td>
              <td>
                <a href={`mailto:${user.email}`}>{user.email}</a>
              </td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
