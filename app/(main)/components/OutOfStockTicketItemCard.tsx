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
      setErrorMessage('A critical connection error occurred.' + e);
      return;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <textarea 
        className="border p-2 rounded"
        value={description} 
        onChange={handleChange} 
        rows={4} 
        disabled={isSaving}
      />
      
      {isChanged && (
        <div className="flex gap-2">
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button 
            onClick={handleCancel} 
            disabled={isSaving}
            className="bg-gray-200 px-3 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      )}

      {errorMessage && (
        <p role="alert" className="text-red-600 font-medium text-sm">
          {errorMessage}
        </p>
      )}
    </div>
  );
}