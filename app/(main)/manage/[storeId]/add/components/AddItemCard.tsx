'use client';

import styles from '@/app/(main)/components/Card.module.css';
import Image from 'next/image';
import defaultItemPhoto from '@/public/image-placeholder.svg';
import { useFormContext } from 'react-hook-form';
import { Form, Button } from 'react-bootstrap';
import { CombinedFormData } from '@/app/(main)/manage/[storeId]/add/components/StoreItemsDonationForm';

type ItemCardProps = {
  index: number;
  photoUrl: string | null;
  item: string;
  subcategory: string;
  category: string;
  description: string;
  onRemove: () => void;
};

export default function AddItemCard({
  index,
  photoUrl,
  item,
  subcategory,
  category,
  description,
  onRemove,
}: ItemCardProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<CombinedFormData>();

  return (
    <div>
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
          <div className={styles.cardTextGroup}>
            <p className={styles.name}>{item}</p>
            <p className={styles.cardText}>{category}</p>
            <p className={styles.cardText}>↳ {subcategory}</p>
          </div>
          <div className={styles.cardTextGroup}>
            <p className={styles.name}>Description</p>
            <p className={styles.cardText}> {description}</p>
          </div>
          <Form.Group
            controlId={`quantity-${index}`}
            className={styles.cardTextGroup}
          >
            <Form.Label className={styles.name}>Quantity</Form.Label>
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
          <Button
            type="button"
            variant="outline-danger"
            className="btn-remove"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }}
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}
