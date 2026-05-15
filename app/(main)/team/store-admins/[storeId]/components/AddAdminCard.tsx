'use client';

import { User } from '@/app/types/user';
import Image from 'next/image';
import styles from '@/app/(main)/components/Card.module.css';
import { Button } from 'react-bootstrap';
import imagePlaceholder from '@/public/image-placeholder.svg';
import { deleteStoreAdmin } from '@/app/actions/store';

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

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={profilePhoto || imagePlaceholder}
          objectFit={'cover'}
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
          <Button
            variant="outline-danger"
            className="btn-remove"
            onClick={() => deleteStoreAdmin(storeAdminId)}
          >
            Remove
          </Button>
        )}
      </div>
    </div>
  );
}
