'use client';

import { usePathname, useRouter } from 'next/navigation';
import '@/app/globals.css';

type OutgoingTicketCardProps = {
  ticketId: string;
  storeName: string;
  date: string;
  status: string;
};

export default function IncomingTicketCard({
  ticketId,
  storeName,
  date,
  status
  
}: OutgoingTicketCardProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Display requestor's name, status, and date submitted
  return (
    <tr
      onClick={() => router.push(`${pathname}/${ticketId}`)}
      style={{ cursor: 'pointer' }}
    >
      <td style={{ width: '30%', border: '1px solid #c5c5c5' }}>{ticketId}</td>
      <td style={{ width: '20%', border: '1px solid #c5c5c5' }}>{storeName}</td>
      <td style={{ width: '35%', border: '1px solid #c5c5c5' }}>{date}</td>
      <td style={{ width: '20%', border: '1px solid #c5c5c5' }}>{status}</td>
    </tr>

  );
}
