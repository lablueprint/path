'use client';

interface OutOfStockTicketItemCardProps {
  ticketItemId: string;
  freeTextDescription: string;
}

export default function OutOfStockTicketItemCard({
  ticketItemId,
  freeTextDescription,
}: OutOfStockTicketItemCardProps) {
  return (
    <div className="border p-4 rounded-lg bg-gray-50">
      <h3>Out of Stock Request</h3>
      <p>Description: {freeTextDescription}</p>
    </div>
  );
}