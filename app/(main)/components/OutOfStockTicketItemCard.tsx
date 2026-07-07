'use client';
import { updateTicketItemDescription } from '@/app/actions/ticket';
import { useState } from 'react';
import styles from '@/app/(main)/components/OutOfStockTicketItemCard.module.css';
import { Button } from 'react-bootstrap';

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
        <div className="button-spacing">
          <Button className="btn-submit" size="sm" onClick={handleSave}>
            Save
          </Button>
          <Button className="btn-cancel" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
