'use client';
import IncomingTicketCard from '@/app/(main)/incoming-tickets/[storeId]/components/IncomingTicketCard';
import { useState } from 'react';
import styles from '@/app/(main)/incoming-tickets/[storeId]/components/Ticket.module.css';

type IncomingTicketsListProps = {
  tickets: {
    id: string;
    requestorFirstName: string;
    requestorLastName: string;
    status: string;
    date: string;
  }[];
};

export default function IncomingTicketsList({
  tickets,
}: IncomingTicketsListProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const statusOptions = ['All', 'Requested', 'Ready', 'Rejected', 'Fulfilled'];

  // Filter tickets to only show tickets with the selected status
  const filteredTickets =
    selectedStatus === 'All'
      ? tickets
      : tickets.filter(
          (ticket) => ticket.status === selectedStatus.toLowerCase(),
        );

  return (
    <div>
      {/* Dropdown menu with status options */}
      <div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          {statusOptions.map((statusOption) => (
            <option key={statusOption} value={statusOption}>
              {statusOption}
            </option>
          ))}
        </select>
      </div>

      {filteredTickets.length > 0 ? (
        <div>
          <table
            className={`table table-borderless text-center align-middle ${styles.table} ${styles.tableWrapper}`}
          >
            <colgroup>
              <col className={styles.idCol} />
              <col className={styles.requestorCol} />
              <col className={styles.statusCol} />
              <col className={styles.dateCol} />
            </colgroup>
            <thead>
              <tr>
                <th>ID</th>
                <th>REQUESTOR</th>
                <th>STATUS</th>
                <th>DATE SUBMITTED</th>
              </tr>
            </thead>
            <tbody>
              {/* Map the list of tickets to IncomingTicketCard components */}
              {filteredTickets.map((ticket) => (
                <IncomingTicketCard
                  key={ticket.id}
                  ticketId={ticket.id}
                  requestorFirstName={ticket.requestorFirstName}
                  requestorLastName={ticket.requestorLastName}
                  status={ticket.status}
                  date={ticket.date}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No tickets found.</p>
      )}
    </div>
  );
}
