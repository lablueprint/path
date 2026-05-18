'use client';
import { useState } from 'react';
import { updateTicketStatus } from '@/app/actions/ticket';
import { Form } from 'react-bootstrap';

type TicketStatus =
  | 'draft'
  | 'requested'
  | 'ready'
  | 'rejected'
  | 'fulfilled'
  | 'approved';

export default function TicketStatusDropdown({
  ticketId,
  currentStatus,
  statusOptions,
}: {
  ticketId: string;
  currentStatus: TicketStatus;
  statusOptions: TicketStatus[];
}) {
  const [selectedStatus, setSelectedStatus] =
    useState<TicketStatus>(currentStatus);
  const [originalStatus, setOriginalStatus] =
    useState<TicketStatus>(currentStatus);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = () => {
    setError(null);
    setSelectedStatus(originalStatus);
  };

  const handleSave = async () => {
    setError(null);

    const result = await updateTicketStatus(selectedStatus, ticketId);
    if (result.success) {
      setOriginalStatus(selectedStatus);
    } else {
      setError('Error updating status. No changes were saved.');
    }
  };

  return (
    <div>
      <Form.Select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value as TicketStatus)}
        style={{ textTransform: 'capitalize' }}
      >
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </Form.Select>

      {selectedStatus !== originalStatus && (
        <div className="d-flex flex-wrap gap-2 mt-2">
          <button
            type="button"
            className="btn-submit py-1 px-3"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            type="button"
            className="btn-cancel py-1 px-3"
            onClick={handleCancel}
          >
            Cancel
          </button>
          {error && <div className="w-100">{error}</div>}
        </div>
      )}
    </div>
  );
}
