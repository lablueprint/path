'use client';

import { useState } from "react";
import { updateTicketItemQuantity } from "../actions/ticket";
import { set } from "react-hook-form";

interface InStockTicketItemCardProps {
  ticketItemId: string;
  quantityRequested: number;
  quantityAvailable: number;
  itemName: string;
  photoUrl: string;
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
  const [savedQuantity, setSavedQuantity] = useState(quantityRequested);  // NEW
  const hasChanged = quantity !== savedQuantity;

  const handleSave = async () => {
    await updateTicketItemQuantity(ticketItemId, quantity);
    setSavedQuantity(quantity);
  };
  const handleCancel = () => {
    setQuantity(savedQuantity);
  };

  return (
    
    <div className="border p-4 rounded-lg">
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
       />
      {hasChanged && (
        <>
        <button onClick={handleSave}>Save</button>
        <button onClick={handleCancel}>Cancel</button>
        </>
      )}
      <h3>{itemName}</h3>
      <p>Category: {categoryName}</p>
      <p>Subcategory: {subcategoryName}</p>
      <p>Quantity Requested: {quantityRequested}</p>
      <p>Available: {quantityAvailable}</p>
      <button></button>
    </div>
  );
}