'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/app/(main)/components/Card.module.css';
import cardStyles from './AddItemCard.module.css';
import Image from 'next/image';
import defaultItemPhoto from '@/public/image-placeholder.svg';
import { useFormContext } from 'react-hook-form';
import { Form } from 'react-bootstrap';
import { CombinedFormData } from '@/app/(main)/manage/[storeId]/add/components/StoreItemsDonationForm';

type ItemCardProps = {
  id: string;
  index: number;
  photoUrl: string | null;
  item: string;
  subcategory: string;
  category: string;
  description: string;
  onRemove: () => void;
};

export default function AddItemCard({
  id,
  index,
  photoUrl,
  item,
  subcategory,
  category,
  description,
  onRemove,
}: ItemCardProps) {
  const pathname = usePathname();
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CombinedFormData>();

  return (
    <Link className={styles.cardLink} href={`${pathname}/${id}`}>
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <Image
            src={photoUrl || defaultItemPhoto}
            objectFit={'cover'}
            alt="Item photo"
            fill
            unoptimized
          />
        </div>
        <div className={styles.cardBody}>
          <p className={styles.name}>{item}</p>
          <div className={cardStyles.container}>
            <p className={styles.cardText}>{category}</p>
            <p className={styles.cardText}>↳ {subcategory}</p>
          </div>
          <p className={cardStyles.label}>Description: </p>
          <p className={styles.cardText}> {description}</p>
          <Form.Group controlId={`quantity-${index}`}>
            <Form.Label className={cardStyles.label}>Quantity</Form.Label>
            <Form.Control
              type="number"
              placeholder="Quantity to add"
              {...register(`items.${index}.quantity`, {
                required: 'Quantity is required',
                valueAsNumber: true,
                min: {
                  value: 1,
                  message: 'Quantity must be at least 1.',
                },
              })}
              isInvalid={!!errors.items?.[index]?.quantity}
              onClick={(e) => e.preventDefault()}
            />
            <Form.Control.Feedback type="invalid">
              {errors.items?.[index]?.quantity?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }}
          >
            Remove
          </button>
        </div>
      </div>
    </Link>
  );
}
