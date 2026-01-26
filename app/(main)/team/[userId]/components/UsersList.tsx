'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function UsersList({
  userInfo,
}: {
  userInfo: {
    user_id: string;
    first_name: string;
    last_name: string;
    user_roles: string;
  }[];
}) {
  console.log(userInfo);
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
      <label>Filter By Role:</label>
      <select
        value={filterRole}
        onChange={(e) => {
          setFilterRole(e.target.value);
        }}
      >
        {roleOptions.map((o) => (
          <option>{o.roleName}</option>
        ))}
      </select>
      {userInfo.map(
        (user) =>
          (filterRole === 'All' || user.user_roles === filterRole) && (
            <Link
              key={user.user_id}
              href={`/team/${user.user_id}`} // Where to navigate
              style={{ textDecoration: 'none', color: 'black' }}
            >
              <div>
                Name: {user.first_name ?? 'FirstName'}{' '}
                {user.last_name ?? 'LastName'} — Role: {user.user_roles}
              </div>
            </Link>
          ),
      )}
    </div>
  );
}
