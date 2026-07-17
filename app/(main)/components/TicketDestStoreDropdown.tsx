'use client';
import { updateTicketDestStore } from '@/app/actions/ticket';
import { Store } from '@/app/types/store';
import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

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
    <div className="form-body align-self-start">
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
        <div className="btn-row">
          <Button type="button" className="btn-submit" onClick={handleSave}>
            Save
          </Button>
          <Button type="button" className="btn-cancel" onClick={handleCancel}>
            Cancel
          </Button>
          {error && <div className="w-100">{error}</div>}
        </div>
      )}
    </div>
  );
}
