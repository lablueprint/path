'use client';

import { usePathname, useRouter } from 'next/navigation';
import styles from '@/app/(main)/outgoing-tickets/components/OutgoingTicket.module.css';

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

  return (
    <tr
      onClick={() => router.push(`${pathname}/${ticketId}`)}
      className={styles.cursor}
    >
      <td>{ticketId}</td>
      <td>{storeName}</td>
      <td>
        <span className={styles.statusBubble}>{status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}</span>
      </td>
      <td>{new Date(date).toLocaleString()}</td>
    </tr>
  );
}
