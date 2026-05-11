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
  const [isSaving, setIsSaving] = useState(false);

  const handleCancel = () => {
    setError(null);
    setSelectedStatus(originalStatus);
  };

  const handleSave = async () => {
    setError(null);
    setIsSaving(true);

    try {
      const result = await updateTicketStatus(selectedStatus, ticketId);
      if (result.success) {
        setOriginalStatus(selectedStatus);
        return;
      } else {
        setError('Failed to update status: ' + result.error);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value as TicketStatus)}
        disabled={isSaving}
      >
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      {selectedStatus !== originalStatus && (
        <div>
          <button type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button type="button" onClick={handleCancel} disabled={isSaving}>
            Cancel
          </button>
          {error && <div>{error}</div>}
        </div>
      )}
    </div>
  );
}
