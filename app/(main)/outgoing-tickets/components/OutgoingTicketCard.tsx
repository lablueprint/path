'use client';

import { usePathname, useRouter } from 'next/navigation';

type OutgoingTicketCardProps = {
  ticketId: string;
  storeName?: string;
  date: string | Date;
  status: string;
};

export default function OutgoingTicketCard({
  ticketId,
  storeName,
  date,
  status,
}: OutgoingTicketCardProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <tr
      onClick={() => router.push(`${pathname}/${ticketId}`)}
      style={{ cursor: 'pointer' }}
    >
      <td
        style={{
          width: '30%',
          border: '1px solid #c5c5c5',
          wordBreak: 'break-word',
        }}
      >
        {ticketId}
      </td>
      <td
        style={{
          width: '20%',
          border: '1px solid #c5c5c5',
          wordBreak: 'break-word',
        }}
      >
        {storeName}
      </td>
      <td style={{ width: '30%', border: '1px solid #c5c5c5' }}>{status}</td>
      <td style={{ width: '20%', border: '1px solid #c5c5c5' }}>
        {new Date(date).toLocaleString()}
      </td>
    </tr>
  );
}
