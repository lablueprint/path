'use client';
import IncomingTicketCard from '@/app/(main)/incoming-tickets/[storeId]/components/IncomingTicketCard';
import { useState } from 'react';
import { Table } from 'react-bootstrap';

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
  const statusOptions = [
    'All',
    'Requested',
    'Ready',
    'Rejected',
    'Fulfilled',
    'Approved',
  ];

  // Filter tickets to only show tickets with the selected status
  const filteredTickets =
    selectedStatus === 'All'
      ? tickets.filter((ticket) => ticket.status !== 'draft')
      : tickets.filter(
          (ticket) => ticket.status === selectedStatus.toLowerCase(),
        );
  const sortedFilteredTickets = [...filteredTickets].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  return (
    <div>
      {/* Dropdown menu with status options */}
      <div className="d-flex justify-content-end">
        <select
          className={`form-select w-auto ${styles.dropdown}`}
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="form-select w-auto dropdown"
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
          <Table borderless responsive>
            <thead className="table-header">
              <tr>
                <th>ID</th>
                <th>REQUESTOR</th>
                <th>STATUS</th>
                <th>DATE SUBMITTED</th>
              </tr>
            </thead>
            <tbody>
              {/* Map the list of tickets to IncomingTicketCard components */}
              {sortedFilteredTickets.map((ticket) => (
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
          </Table>
        </div>
      ) : (
        <p>No tickets found.</p>
      )}
    </div>
  );
}
