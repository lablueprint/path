'use client';
import { updateTicketDestStore } from '@/app/actions/ticket';
import { Store } from '@/app/types/store';
import { useState } from 'react';
import { Form } from 'react-bootstrap';

export default function TicketDestStoreDropdown({
  ticketId,
  currentDestStore,
  destStoreOptions,
}: {
  ticketId: string;
  currentDestStore: Store | null;
  destStoreOptions: { store: Store }[];
}) {
  const [selectedDestStore, setSelectedDestStore] = useState<Store | null>(
    currentDestStore,
  );
  const [originalDestStore, setOriginalDestStore] = useState<Store | null>(
    currentDestStore,
  );
  const [error, setError] = useState<string | null>(null);

  const handleCancel = () => {
    setError(null);
    setSelectedDestStore(originalDestStore);
  };

  const handleSave = async () => {
    setError(null);

    const result = await updateTicketDestStore(
      selectedDestStore?.store_id ?? null,
      ticketId,
    );
    if (result.success) {
      setOriginalDestStore(selectedDestStore);
    } else {
      setError('Error updating destination store. No changes were saved.');
    }
  };

  return (
    <div>
      <Form.Select
        value={selectedDestStore?.store_id || ''}
        onChange={(e) => {
          const selectedStoreId = e.target.value;
          if (selectedStoreId === '') {
            setSelectedDestStore(null);
            return;
          }

          const selectedStore =
            destStoreOptions.find(
              ({ store }) => store.store_id === selectedStoreId,
            )?.store ?? null;

          setSelectedDestStore(selectedStore);
        }}
      >
        <option value="">No Destination Store</option>
        {[...destStoreOptions]
          .sort((a, b) => a.store.name.localeCompare(b.store.name))
          .map(({ store }) => (
            <option key={store.store_id} value={store.store_id}>
              {store.name}
            </option>
          ))}
      </Form.Select>
      {selectedDestStore != originalDestStore && (
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
