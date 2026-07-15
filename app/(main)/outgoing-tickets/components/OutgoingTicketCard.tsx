'use client';

import { usePathname, useRouter } from 'next/navigation';
import styles from '@/app/(main)/components/TicketCard.module.css';

type OutgoingTicketCardProps = {
  ticketId: string;
  storeName: string;
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

  /* Stuatus Class mapping for colors for different statuses */
  const statusClassMap: Record<string, string> = {
    requested: styles.statusRequested,
    ready: styles.statusReady,
    rejected: styles.statusRejected,
    fulfilled: styles.statusFulfilled,
    approved: styles.statusApproved,
  };

  const normalizedStatus = status.toLowerCase();
  const statusClass = statusClassMap[normalizedStatus] ?? styles.statusDefault;

  return (
    <tr
      onClick={() => router.push(`${pathname}/${ticketId}`)}
      className={styles.cursor}
    >
      <td>{ticketId}</td>
      <td>{storeName}</td>
      <td>
        <div className={`${styles.statusBubble} ${statusClass}`}>
          {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
        </div>
      </td>
      <td>{new Date(date).toLocaleString()}</td>
    </tr>
  );
}
