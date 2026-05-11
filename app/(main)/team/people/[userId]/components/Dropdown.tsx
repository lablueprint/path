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
  const [originalRoleId, setOriginalRoleId] = useState(roleId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const hasChanged = currentRoleId !== originalRoleId;

  const handleSave = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const res = await updateUserRole(userId, currentRoleId);
      if (!res.success) {
        setErrorMessage(res.error ?? 'Insufficient privileges to update role.');
        return;
      }
      setOriginalRoleId(currentRoleId);
      setSuccessMessage('Role updated.');
    } catch (error) {
      console.error('Role update error:', error);
      setErrorMessage('Unable to update role. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setCurrentRoleId(originalRoleId);
    setErrorMessage('');
    setSuccessMessage('');
  };

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
    <div>
      <select
        value={currentRoleId}
        onChange={(e) => setCurrentRoleId(Number(e.target.value))}
        disabled={isSubmitting}
      >
        {allRoles.map((r) => (
          <option key={r.id} value={r.id}>
            {r.roleName}
          </option>
        ))}
      </select>
      {hasChanged && (
        <div>
          <button type="button" onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
          <button type="button" onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </button>
        </div>
      )}
      {errorMessage && <p role="alert">{errorMessage}</p>}
      {successMessage && <p role="status">{successMessage}</p>}
    </div>
  );
}
