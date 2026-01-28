'use client';

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
  return (
    <div className="border p-4 rounded-lg">
      <img src={photoUrl} alt={itemName} className="w-32 h-32 object-cover" />
      <h3>{itemName}</h3>
      <p>Category: {categoryName}</p>
      <p>Subcategory: {subcategoryName}</p>
      <p>Quantity Requested: {quantityRequested}</p>
      <p>Available: {quantityAvailable}</p>
    </div>
  );
}