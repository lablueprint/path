'use client';
import { updateTicketItemDescription } from '@/app/actions/ticket';
import { useState } from 'react';
import styles from '@/app/(main)/components/OutOfStockTicketItemCard.module.css';

interface OutOfStockTicketItemCardProps {
  ticketItemId: string;
  freeTextDescription: string;
}

export default function OutOfStockTicketItemCard({
  ticketItemId,
  freeTextDescription,
}: OutOfStockTicketItemCardProps) {
  const [description, setDescription] = useState(freeTextDescription);
  const [isChanged, setIsChanged] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setDescription(newValue);
    setIsChanged(newValue !== freeTextDescription);
  };
  const handleCancel = () => {
    setDescription(freeTextDescription);
    setIsChanged(false);
  };
  const handleSave = async () => {
    await updateTicketItemDescription(ticketItemId, description);
    setIsChanged(false);
  };
  return (
    <div className={styles.cardContainer}>
      <textarea
        className={styles.descriptionInput}
        value={description}
        onChange={handleChange}
        rows={4}
      />
      {isChanged && (
        <div className={styles.actionsRow}>
          <button className="btn-submit py-1 px-3" onClick={handleSave}>
            Save
          </button>
          <button className="btn-cancel py-1 px-3" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
