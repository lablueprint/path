'use client';
import { useState } from 'react';
import { updateTicketItemQuantity } from '@/app/actions/ticket';

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
  const [isSaving, setIsSaving] = useState(false);

  const hasChanged = quantity !== savedQuantity;

  const handleSave = async () => {
    setErrorMessage('');
    if (quantity < 1) {
      setErrorMessage('Please input a number greater than 0.');
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateTicketItemQuantity(ticketItemId, quantity);

      if (!result.success) {
        setErrorMessage('Failed to update ticket item quantity.' + result.error);
        return;
      }

      setSavedQuantity(quantity);
      setErrorMessage('');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setQuantity(savedQuantity);
    setErrorMessage('');
  };

  return (
    <div>
      <h3>{itemName}</h3>
      {photoUrl ? <p>Photo URL: {photoUrl}</p> : null}
      <p>Category: {categoryName}</p>
      <p>Subcategory: {subcategoryName}</p>
      <p>Quantity available: {quantityAvailable}</p>
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
          disabled={isSaving}
        />
      </label>
      {errorMessage && (
        <p role="alert" style={{ color: 'red' }}>
          {errorMessage}
        </p>
      )}
      {hasChanged && (
        <>
          <button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button onClick={handleCancel} disabled={isSaving}>
            Cancel
          </button>
        </>
      )}
    </div>
  );
}
