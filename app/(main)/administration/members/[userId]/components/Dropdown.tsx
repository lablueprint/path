'use client';

import { useState } from 'react';
import { updateUserRole } from '@/app/actions/user';
import profileFormStyles from '@/app/(main)/profile/components/ProfileForm.module.css';
import { Button, Alert } from 'react-bootstrap';

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

  const hasChanged = currentRoleId !== originalRoleId;

  const handleSave = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const res = await updateUserRole(userId, currentRoleId);
      if (!res.success) {
        setErrorMessage('Insufficient privileges to update role.');
        return;
      }
      setOriginalRoleId(currentRoleId);
    } catch {
      setErrorMessage('Failed to update role.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setCurrentRoleId(originalRoleId);
    setErrorMessage('');
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

  return (
    <div className="gap-container">
      <div>
        <p className={profileFormStyles.textLabel}>Role</p>
        <select
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
      {hasChanged && (
        <div className="btn-row">
          <Button
            type="button"
            className="btn-submit"
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
          <Button
            type="button"
            className="btn-cancel"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      )}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
    </div>
  );
}
