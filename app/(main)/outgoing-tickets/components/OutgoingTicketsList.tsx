'use client';
import OutgoingTicketCard from '@/app/(main)/outgoing-tickets/components/OutgoingTicketCard';
import { useState } from 'react';
import { Table, Form } from 'react-bootstrap';

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
  const statusOptions = [
    'All',
    'Requested',
    'Approved',
    'Ready',
    'Fulfilled',
    'Rejected',
  ];
  const filteredTickets =
    selectedStatus === 'All'
      ? tickets.filter((ticket) => ticket.status !== 'draft')
      : tickets.filter(
          (ticket) => ticket.status === selectedStatus.toLowerCase(),
        );

  const sortedFilteredTickets = [...filteredTickets].sort((a, b) =>
    b.date_submitted.localeCompare(a.date_submitted),
  );

  return (
    <>
      {/* Dropdown menu with status options */}
      <div className="d-flex">
        <div>
          <Form.Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {statusOptions.map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {statusOption}
              </option>
            ))}
          </Form.Select>
        </div>
      </div>

      {filteredTickets.length > 0 ? (
        <Table borderless responsive>
          <thead className="table-header">
            <tr>
              <th>ID</th>
              <th>Store Name</th>
              <th>Status</th>
              <th>Date Submitted</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {sortedFilteredTickets.map((ticket) => (
              <OutgoingTicketCard
                key={ticket.ticket_id}
                ticketId={ticket.ticket_id}
                date={ticket.date_submitted}
                status={ticket.status}
                storeName={(ticket.stores as unknown as { name: string }).name}
              />
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No tickets found.</p>
      )}
    </>
  );
}
