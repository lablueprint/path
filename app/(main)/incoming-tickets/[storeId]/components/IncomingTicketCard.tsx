'use client';

import { usePathname, useRouter } from 'next/navigation';
import styles from '@/app/(main)/components/TicketCard.module.css';

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

  /* Status class mapping for colors for different statuses */
  const statusClassMap: Record<string, string> = {
    requested: styles.statusRequested,
    ready: styles.statusReady,
    rejected: styles.statusRejected,
    fulfilled: styles.statusFulfilled,
    approved: styles.statusApproved,
  };

  const normalizedStatus = status.toLowerCase();
  const statusClass = statusClassMap[normalizedStatus] ?? styles.statusDefault;

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
        <div className={`${styles.statusBubble} ${statusClass}`}>
          {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
        </div>
      </td>
      <td>{new Date(date).toLocaleString()}</td>
    </tr>
  );
}
