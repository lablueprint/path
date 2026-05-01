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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
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
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');
        try {
          const res = await updateUserRole(userId, currentRoleId);
          if (!res.success) {
            setErrorMessage(
              res.error ?? 'Insufficient privileges to update role.',
            );
            return;
          }
          setSuccessMessage('Role updated.');
        } catch (error) {
          console.error('Role update error:', error);
          setErrorMessage('Unable to update role. Please try again.');
        } finally {
          setIsSubmitting(false);
        }
      }}
    >
      <select
        name="role"
        value={currentRoleId}
        onChange={(e) => setCurrentRoleId(Number(e.target.value))}
      >
        {allRoles.map((r) => (
          <option key={r.id} value={r.id}>
            {r.roleName}
          </option>
        ))}
      </select>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Updating...' : 'Update role'}
      </button>
      {errorMessage && <p role="alert">{errorMessage}</p>}
      {successMessage && <p role="status">{successMessage}</p>}
    </form>
  );
}
