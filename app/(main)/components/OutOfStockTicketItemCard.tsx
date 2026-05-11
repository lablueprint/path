'use client';

import { updateTicketItemDescription } from '@/app/actions/ticket';
import { useState } from 'react';

interface OutOfStockTicketItemCardProps {
  ticketItemId: string;
  freeTextDescription: string;
}

export default function OutOfStockTicketItemCard({
  ticketItemId,
  freeTextDescription: initialDescription,
}: OutOfStockTicketItemCardProps) {
  const [description, setDescription] = useState(initialDescription);
  const [isChanged, setIsChanged] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setDescription(newValue);
    setIsChanged(newValue !== initialDescription);
  };

  const handleCancel = () => {
    setDescription(initialDescription);
    setIsChanged(false);
    setErrorMessage('');
  };

  const handleSave = async () => {
    setErrorMessage('');
    setIsSaving(true);

    try {
      const { error } = await updateTicketItemDescription(
        ticketItemId,
        description,
      );

      if (error) {
        setErrorMessage('Failed to update description: ' + error);
        setIsSaving(false);
        return;
      }

      // Success Path
      setIsChanged(false);
    } catch (e) {
      // Handle infrastructure/network errors
      setErrorMessage('A critical connection error occurred. ' + e);
      return;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={description}
        onChange={handleChange}
        rows={4}
        disabled={isSaving}
      />

      {isChanged && (
        <div>
          <button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button onClick={handleCancel} disabled={isSaving}>
            Cancel
          </button>
        </div>
      )}

      {errorMessage && <p role="alert">{errorMessage}</p>}
    </div>
  );
}
