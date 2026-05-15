'use client';

import { useState } from 'react';
import { updateUserRole } from '@/app/actions/user';

export default function Dropdown({
  userId,
  roleId,
}: {
  userId: string;
  roleId: number;
}) {
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

  // sort roles by roleOrder, with any roles not in the list appearing at the end
  function formatRole(role: string) {
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  }
  const roleOrder = ['Owner', 'Superadmin', 'Admin', 'Requestor', 'Default'];
  const sortedRoles = [...allRoles].sort((a, b) => {
    const aIndex = roleOrder.indexOf(formatRole(a.roleName));
    const bIndex = roleOrder.indexOf(formatRole(b.roleName));
    return (
      (aIndex === -1 ? roleOrder.length : aIndex) -
      (bIndex === -1 ? roleOrder.length : bIndex)
    );
  });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const res = await updateUserRole(userId, currentRoleId);
        if (!res.success) {
          alert('Insufficient privileges to update role');
        }
      }}
    >
      <select
        name="role"
        className="form-select w-auto"
        value={currentRoleId}
        onChange={(e) => setCurrentRoleId(Number(e.target.value))}
      >
        {sortedRoles.map((r) => (
          <option key={r.id} value={r.id}>
            {formatRole(r.roleName)}
          </option>
        ))}
      </select>
      <div className="btn-row">
        <button className="btn-submit" type="submit">
          Update role
        </button>
      </div>
    </form>
  );
}
