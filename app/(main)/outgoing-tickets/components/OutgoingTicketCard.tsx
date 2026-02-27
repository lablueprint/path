'use client';

import { usePathname, useRouter } from 'next/navigation';
import '@/app/globals.css';

type IncomingTicketCardProps = {
  id: string;
  requestorFirstName: string;
  requestorLastName: string;
  status: string;
  date: string;
};

export default function IncomingTicketCard({
  id,
  requestorFirstName,
  requestorLastName,
  status,
  date,
}: IncomingTicketCardProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Display requestor's name, status, and date submitted
  return (
    <tr
      onClick={() => router.push(`${pathname}/${id}`)}
      style={{ cursor: 'pointer' }}
    >
      <td style={{ width: '30%', border: '1px solid #c5c5c5' }}>{id}</td>
      <td style={{ width: '20%', border: '1px solid #c5c5c5' }}>{status}</td>
      <td style={{ width: '35%', border: '1px solid #c5c5c5' }}>{requestorFirstName} {requestorLastName}</td>
      <td style={{ width: '20%', border: '1px solid #c5c5c5' }}>{new Date(date).toLocaleDateString()}</td>
    </tr>

  );
}
