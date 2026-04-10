'use client';
import IncomingTicketCard from '@/app/(main)/incoming-tickets/[storeId]/components/IncomingTicketCard';
import { useState } from 'react';

type IncomingTicketsListProps = {
  tickets: {
    id: string;
    requestorFirstName: string;
    requestorLastName: string;
    status: string;
    date: string;
  } [];
};

export default function IncomingTicketsList({
  tickets,
}: IncomingTicketsListProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const statusOptions = ['All', 'Requested', 'Ready', 'Rejected', 'Fulfilled'];

  // Filter tickets to only show tickets with the selected status
  const filteredTickets = selectedStatus === 'All'
    ? tickets
    : tickets.filter((ticket) => ticket.status === selectedStatus.toLowerCase());
  
  console.log("selected status:", selectedStatus);
  console.log("tickets:", tickets);
  console.log("filtered tickets:", filteredTickets);

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

      {/* Display heading that indicates the status */}
      <h2>{selectedStatus.toUpperCase()} TICKETS</h2>

      {filteredTickets.length > 0 ? (
        <div>
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
                <th style={{ width: '20%' }}>Status</th>
                <th style={{ width: '30%' }}>Requestor</th>
                <th style={{ width: '20%' }}>Date Submitted</th>
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
