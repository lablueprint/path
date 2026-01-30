'use client';
import { useState, useEffect } from 'react';
import { updateUserRole } from '@/app/actions/user';

//import { Example } from '@/app/types/example';

export default function Dropdown({ userId, roleId }) {
  const [currentRoleId, setCurrentRoleId] = useState(roleId);
  const allRoles = [
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
  useEffect(() => {
    console.log(currentRoleId);
  }, [currentRoleId]);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const res = await updateUserRole(userId, currentRoleId);
        if (!res.success) {
          alert('Incorrect privileges to update role');
        }
      }}
    >
      <select
        name="role"
        value={currentRoleId}
        onChange={(e) => setCurrentRoleId(e.target.value)}
      >
        {allRoles.map((r) => (
          <option key={r.id} value={r.id}>
            {r.roleName}
          </option>
        ))}
      </select>
      <button type="submit">Update Role</button>
    </form>
  );
}
