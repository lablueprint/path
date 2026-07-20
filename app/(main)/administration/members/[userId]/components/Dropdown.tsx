'use client';

import { useState } from 'react';
import { updateUserRole } from '@/app/actions/user';
import profileFormStyles from '@/app/(main)/profile/components/ProfileForm.module.css';
import { Button } from 'react-bootstrap';

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
  const roleOrder = ['Default', 'Requestor', 'Admin', 'Superadmin', 'Owner'];
  const sortedRoles = [...allRoles].sort((a, b) => {
    const aIndex = roleOrder.indexOf(formatRole(a.roleName));
    const bIndex = roleOrder.indexOf(formatRole(b.roleName));
    return (
      (aIndex === -1 ? roleOrder.length : aIndex) -
      (bIndex === -1 ? roleOrder.length : bIndex)
    );
  });

  const handleCancel = () => {
    setCurrentRoleId(roleId);
  };

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
      <div className="gap-container">
        <div>
          <p className={profileFormStyles.textLabel}>Role</p>
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
        </div>
        {currentRoleId !== roleId && (
          <div className="btn-row">
            <Button className="btn-submit" type="submit">
              Save
            </Button>
            <Button type="button" className="btn-cancel" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        )}
      </div>
    </form>
  );
}
