'use client';
import { updateTicketDestStore } from '@/app/actions/ticket';
import { Store } from '@/app/types/store';
import { useState } from 'react';

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
      <select
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
        {destStoreOptions.map(({ store }) => (
          <option key={store.store_id} value={store.store_id}>
            {store.name}
          </option>
        ))}
      </select>
      {selectedDestStore != originalDestStore && (
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
