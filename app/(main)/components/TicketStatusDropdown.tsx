'use client';
import { useState } from 'react';
import { updateTicketStatus } from '@/app/actions/ticket';
import { Form, Button } from 'react-bootstrap';

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
    <div className="btn-row">
      <Form.Select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value as TicketStatus)}
        className="text-capitalize form-select-sm"
      >
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </Form.Select>

      {selectedStatus !== originalStatus && (
        <>
          <Button
            type="button"
            className="btn-submit btn-sm"
            onClick={handleSave}
          >
            Save
          </Button>
          <Button
            type="button"
            className="btn-cancel btn-sm"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          {error && <div className="w-100">{error}</div>}
        </>
      )}
    </div>
  );
}
