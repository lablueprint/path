'use client';
import {updateTicketItemDescription} from '../actions/ticket';
import {useState} from 'react';

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
  }
  const handleSave = async () => {
    await updateTicketItemDescription(ticketItemId, description);
    setIsChanged(false);
  }
  return (
    <div>
      <h3>Update Text Description</h3>
      <textarea
        value={description}
        onChange={handleChange}
        rows={4}
      />
      
      {isChanged && (
        <div className="flex gap-2">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      )}

      
      <p>Description: {freeTextDescription}</p>
    </div>
  );
}