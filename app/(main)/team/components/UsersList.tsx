'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function UsersList({
  users,
}: {
  users: {
    user_id: string;
    first_name: string;
    last_name: string;
    role: string;
  }[];
}) {
  const roleOptions = [
    {
      id: 0,
      roleName: 'All',
    },
    {
      id: 1,
      roleName: 'default',
    },
    {
      id: 2,
      roleName: 'requestor',
    },
    {
      id: 3,
      roleName: 'admin',
    },
    {
      id: 4,
      roleName: 'superadmin',
    },
    {
      id: 5,
      roleName: 'owner',
    },
  ];
  const [filterRole, setFilterRole] = useState('All');
  return (
    <div>
      <select
        value={filterRole}
        onChange={(e) => {
          setFilterRole(e.target.value);
        }}
      >
        {roleOptions.map((o) => (
          <option key={o.id}>{o.roleName}</option>
        ))}
      </select>
      {users.map(
        (user) =>
          (filterRole === 'All' || user.role === filterRole) && (
            <Link
              key={user.user_id}
              href={`/team/profile/${user.user_id}`} // Where to navigate
            >
              <div>
                Name: {user.first_name ?? 'FirstName'}{' '}
                {user.last_name ?? 'LastName'} — Role: {user.role}
              </div>
            </Link>
          ),
      )}
    </div>
  );
}
