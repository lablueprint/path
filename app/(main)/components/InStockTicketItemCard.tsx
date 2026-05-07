'use client';
import { useState } from 'react';
import { updateTicketItemQuantity } from '@/app/actions/ticket';
import styles from '@/app/(main)/components/InStockTicketItemCard.module.css';
import Image from 'next/image';
import imagePlaceholder from '@/public/image-placeholder.svg';

interface InStockTicketItemCardProps {
  ticketItemId: string;
  quantityRequested: number;
  quantityAvailable: number;
  itemName: string;
  photoUrl: string | null;
  subcategoryName: string;
  categoryName: string;
}

export default function InStockTicketItemCard({
  ticketItemId,
  quantityRequested,
  quantityAvailable,
  itemName,
  photoUrl,
  subcategoryName,
  categoryName,
}: InStockTicketItemCardProps) {
  const [quantity, setQuantity] = useState(quantityRequested);
  const [savedQuantity, setSavedQuantity] = useState(quantityRequested);
  const [errorMessage, setErrorMessage] = useState('');

  const hasChanged = quantity !== savedQuantity;

  const handleSave = async () => {
    if (quantity < 1) {
      setErrorMessage('Please input a number greater than 0.');
      return;
    }

    const result = await updateTicketItemQuantity(ticketItemId, quantity);

    if (!result.success) {
      console.error('Error changing ticket item quantity:', result.error);
      return;
    }

    setSavedQuantity(quantity);
    setErrorMessage('');
  };

  const handleCancel = () => {
    setQuantity(savedQuantity);
    setErrorMessage('');
  };

  return (
    <div className={styles.itemCard}>
      <Image
        className={styles.itemImage}
        src={imagePlaceholder}
        alt={`Picture of ${itemName}`}
        width={77}
        height={77}
        unoptimized
      ></Image>
      <div className={styles.textDescriptors}>
        <h3>{itemName}</h3>
        <div className={styles.metaRow}>
          <p>
            Category:{' '}
            <span className={styles.descriptorValue}>{categoryName}</span>
          </p>
          <p>
            Subcategory:{' '}
            <span className={styles.descriptorValue}>{subcategoryName}</span>
          </p>
        </div>
      </div>
      <div className={styles.numericalDescriptors}>
        <div className={styles.quantityCard}>Qty: {quantityAvailable}</div>
        <div className={styles.availabilityCard}>
          <label>
            Quantity requested:{' '}
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => {
                setQuantity(Number(e.target.value));
                setErrorMessage('');
              }}
            />
          </label>
        </div>
        {errorMessage && <p role="alert">{errorMessage}</p>}
        {hasChanged && (
          <>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </>
        )}
      </div>
    </div>
  );
}
