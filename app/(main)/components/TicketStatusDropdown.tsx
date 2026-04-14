'use client';
import { useState } from 'react';
import { updateTicketStatus } from '@/app/actions/ticket';

type TicketStatus = 'draft' | 'requested' | 'ready' | 'rejected' | 'fulfilled';

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
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value as TicketStatus)}
      >
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      {selectedStatus !== originalStatus && (
        <div>
          <button type="button" onClick={handleSave}>
            Save
          </button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
          {error && <div>{error}</div>}
        </div>
      )}
    </div>
  );
}
