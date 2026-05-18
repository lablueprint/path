import Link from 'next/link';
import Image from 'next/image';
import { Table } from 'react-bootstrap';
import imagePlaceholder from '@/public/image-placeholder.svg';

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
      <Table borderless responsive>
        <thead className="table-header">
          <tr>
            <th>Team Member</th>
            <th>Role</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id}>
              <td>
                <Image
                  src={user.profile_photo_url || imagePlaceholder}
                  alt={`Profile picture for ${user.first_name}`}
                  height={32}
                  width={32}
                  unoptimized
                  className="rounded-circle me-2"
                />
                <Link
                  key={user.user_id}
                  href={`/team/people/${user.user_id}`} // Where to navigate
                  className="userLink"
                >
                  {user.first_name + ' ' + user.last_name}
                </Link>
              </td>
              <td className="text-uppercase">{user.role}</td>
              <td>
                <a className="userEmail" href={`mailto:${user.email}`}>
                  {user.email}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
