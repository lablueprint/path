'use client';
import OutgoingTicketCard from '@/app/(main)/outgoing-tickets/components/OutgoingTicketCard';
import { useState } from 'react';

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
  const filteredTickets = selectedStatus === 'All'
    ? tickets
    : tickets.filter((ticket) => ticket.status === selectedStatus.toLowerCase());

  return (
    <div>
      {/* Dropdown menu with status options */}
      <div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          {statusOptions.map((statusOption) => (
            <option key={statusOption} value={statusOption}>{statusOption}</option>
          ))}
        </select>
      </div>

      <h2>{selectedStatus.toUpperCase()} TICKETS</h2>
      {filteredTickets.length > 0 ? (
        <table
          style={{
            width: '100%',
            tableLayout: 'fixed',
            borderCollapse: 'collapse',
          }}
        >
          <thead>
            <tr>
              <th style={{ width: '30%' }}>Ticket ID</th>
              <th style={{ width: '20%' }}>Store Name</th>
              <th style={{ width: '30%' }}>Status</th>
              <th style={{ width: '20%' }}>Date Submitted</th>
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
