'use client';
import { useState } from 'react';
import { updateTicketItemQuantity } from '@/app/actions/ticket';
import Image from 'next/image';
import defaultItemPhoto from '@/public/default-profile-picture.png';

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
  const [savedQuantity, setSavedQuantity] = useState(quantityRequested); // NEW
  const hasChanged = quantity !== savedQuantity;

  const handleSave = async () => {
    await updateTicketItemQuantity(ticketItemId, quantity);
    setSavedQuantity(quantity);
  };
  const handleCancel = () => {
    setQuantity(savedQuantity);
  };

  return (
    <div>
      <Image
        src={photoUrl || defaultItemPhoto}
        alt={itemName}
        width={64}
        height={64}
        style={{ objectFit: 'cover' }}
        unoptimized
      />
      <h3>{itemName}</h3>
      <p>Category: {categoryName}</p>
      <p>Subcategory: {subcategoryName}</p>
      <p>Quantity available: {quantityAvailable}</p>
      <label>
        Quantity requested:{' '}
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </label>
      {hasChanged && (
        <>
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </>
      )}
    </div>
  );
}
