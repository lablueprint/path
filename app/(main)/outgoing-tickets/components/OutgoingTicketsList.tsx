'use client';
import OutgoingTicketCard from '@/app/(main)/outgoing-tickets/components/OutgoingTicketCard';
import { useState } from 'react';
import styles from '@/app/(main)/outgoing-tickets/components/OutgoingTicket.module.css';

type Ticket = {
  ticket_id: string;
  status: string;
  date_submitted: string;
  store_id: string;
  stores: { name: string }[] | null;
};

export default function OutgoingTicketsList({
  tickets,
}: {
  tickets: Ticket[];
}) {
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const statusOptions = ['All', 'Requested', 'Ready', 'Rejected', 'Fulfilled'];
  const filteredTickets =
    selectedStatus === 'All'
      ? tickets
      : tickets.filter(
          (ticket) => ticket.status === selectedStatus.toLowerCase(),
        );

  return (
    <div>
      {/* Dropdown menu with status options */}
      <div className="d-flex justify-content-end">
        <select
          className={`form-select w-auto ${styles.dropdown}`}
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
        <table
          className={`table table-borderless text-center align-middle ${styles.table} ${styles.tableWrapper}`}
        >
          <colgroup>
            <col className={styles.idCol} />
            <col className={styles.storeCol} />
            <col className={styles.statusCol} />
            <col className={styles.dateCol} />
          </colgroup>
          <thead>
            <tr>
              <th>ID</th>
              <th>STORE NAME</th>
              <th>STATUS</th>
              <th>DATE SUBMITTED</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <OutgoingTicketCard
                key={ticket.ticket_id}
                ticketId={ticket.ticket_id}
                date={ticket.date_submitted}
                status={ticket.status}
                storeName={(ticket.stores as unknown as { name: string }).name}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tickets found.</p>
      )}
    </div>
  );
}
