'use client';

import { useState } from 'react';
import { deleteStoreAdmin } from '@/app/actions/store';

export default function DeleteStoreAdminButton({
  storeAdminId,
}: {
  storeAdminId: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const result = await deleteStoreAdmin(storeAdminId);
      if (!result.success) {
        setErrorMessage(result.error ?? 'Failed to remove admin.');
        return;
      }
      setSuccessMessage('Admin removed.');
    } catch (error) {
      console.error('Store admin deletion error:', error);
      setErrorMessage('Failed to remove admin. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button type="button" onClick={handleDelete} disabled={isDeleting}>
        {isDeleting ? 'Removing...' : 'Remove admin'}
      </button>
      {errorMessage && <p role="alert">{errorMessage}</p>}
      {successMessage && <p role="status">{successMessage}</p>}
    </>
  );
}
