'use client';

import { usePathname, useRouter } from 'next/navigation';
import styles from '@/app/(main)/components/Ticket.module.css';

type IncomingTicketCardProps = {
  ticketId: string;
  requestorFirstName: string;
  requestorLastName: string;
  status: string;
  date: string;
};

export default function IncomingTicketCard({
  ticketId,
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
      onClick={() => router.push(`${pathname}/${ticketId}`)}
      style={{ cursor: 'pointer' }}
    >
      <td>{ticketId}</td>
      <td>
        {requestorFirstName} {requestorLastName}
      </td>

      <td>
        <span className={styles.statusBubble}>
          {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
        </span>
      </td>

      <td>{new Date(date).toLocaleString()}</td>
    </tr>
  );
}
