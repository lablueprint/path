import Link from 'next/link';
import Image from 'next/image';
import styles from '@/app/(main)/team/people/components/UsersList.module.css';
import { Table } from 'react-bootstrap';

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
      <Table borderless className={styles.userTable}>
        <thead className={styles.userTableHeader}>
          <tr className={styles.userTableRow}>
            <th className={`w-30 ${styles.headerCell}`}>Requestor</th>
            <th className={`w-30 ${styles.headerCell}`}>Role</th>
            <th className={`w-40 ${styles.headerCell}`}>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id} className={styles.userTableRow}>
              <td>
                <Image
                  src={user.profile_photo_url || '/default-profile-picture.png'}
                  alt={`Profile picture for ${user.first_name}`}
                  height={32}
                  width={32}
                  unoptimized
                  className={styles.userPfp}
                />
                <Link
                  key={user.user_id}
                  href={`/team/people/${user.user_id}`} // Where to navigate
                  className={styles.userLink}
                >
                  {user.first_name + ' ' + user.last_name}
                </Link>
              </td>
              <td className={styles.userRole}>{user.role}</td>
              <td>
                <a className={styles.userEmail} href={`mailto:${user.email}`}>
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
