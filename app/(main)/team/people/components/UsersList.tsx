'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from '@/app/(main)/team/people/components/UsersList.module.css';
import { Table } from 'react-bootstrap';
import imagePlaceholder from '@/public/image-placeholder.svg';
import { useState } from 'react';
import ViewToggle, { ViewMode } from '@/app/(main)/components/ViewToggle';
import TeamUserCard from '@/app/(main)/components/TeamUserCard';

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
  const [view, setView] = useState<ViewMode>('grid');

  return (
    <div>
      <div className={styles.header}>
        <ViewToggle defaultView="grid" onChange={setView} />
      </div>
      {view === 'grid' ? (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-5">
          {users?.map((user) => (
            <div key={user.user_id} className="col">
              <TeamUserCard user={user} />
            </div>
          ))}
        </div>
      ) : (
        <Table borderless>
          <thead className="table-header">
            <tr>
              <th>Requestor</th>
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
                    alt={user.first_name + ' ' + user.last_name}
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
      )}
    </div>
  );
}
