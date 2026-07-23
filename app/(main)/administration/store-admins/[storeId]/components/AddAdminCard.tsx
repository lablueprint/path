'use client';

import { User } from '@/app/types/user';
import Image from 'next/image';
import styles from '@/app/(main)/components/Card.module.css';
import { Button, Alert } from 'react-bootstrap';
import imagePlaceholder from '@/public/image-placeholder.svg';
import { deleteStoreAdmin } from '@/app/actions/store';
import { useState } from 'react';

interface AddAdminCardProps {
  user: User;
  showRemove: boolean;
  storeAdminId: string;
}

export default function AddAdminCard({
  user,
  showRemove,
  storeAdminId,
}: AddAdminCardProps) {
  const profilePhoto = user.profile_photo_url?.trim();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMessage('');
    try {
      const result = await deleteStoreAdmin(storeAdminId);
      if (!result.success) {
        setErrorMessage('Failed to remove admin.');
        return;
      }
    } catch (error) {
      console.error('Store admin deletion error:', error);
      setErrorMessage('Failed to remove admin.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <Image
            src={profilePhoto || imagePlaceholder}
            className="object-fit-cover"
            alt={user.first_name + ' ' + user.last_name}
            fill
            unoptimized
          />
        </div>
        <div className={styles.cardBody}>
          <div className={styles.cardTextGroup}>
            <p className={styles.name}>
              {user.first_name + ' ' + user.last_name}
            </p>
            <p className={styles.cardText}>{user.email}</p>
          </div>
          {showRemove && (
            <>
              <Button
                variant="outline-danger"
                className="btn-remove"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Removing...' : 'Remove'}
              </Button>
              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
