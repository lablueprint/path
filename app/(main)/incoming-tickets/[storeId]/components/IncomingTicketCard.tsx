'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  // Display requestor's name, status, and date submitted
  return (
    <Link className="ticket-card-text" href={`${pathname}/${id}`}>
      <div className="ticket-card">
        <h3>Ticket ID: {id}</h3>
        <p>
          <strong>Requestor:</strong> {requestorFirstName} {requestorLastName}
        </p>
        <p>
          <strong>Status:</strong> {status}
        </p>
        <p>
          <strong>Date submitted:</strong> {new Date(date).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
}
