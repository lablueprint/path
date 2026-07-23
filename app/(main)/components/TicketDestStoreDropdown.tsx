'use client';
import { updateTicketDestStore } from '@/app/actions/ticket';
import { Store } from '@/app/types/store';
import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

export default function TicketDestStoreDropdown({
  ticketId,
  currentDestStore,
  destStoreOptions,
}: {
  ticketId: string;
  currentDestStore: Store | null;
  destStoreOptions: { store: Store }[];
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDestStore, setSelectedDestStore] = useState<Store | null>(
    currentDestStore,
  );
  const [originalDestStore, setOriginalDestStore] = useState<Store | null>(
    currentDestStore,
  );
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleCancel = () => {
    setErrorMessage('');
    setSelectedDestStore(originalDestStore);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage('');

    const result = await updateTicketDestStore(
      selectedDestStore?.store_id ?? null,
      ticketId,
    );
    if (result.success) {
      setOriginalDestStore(selectedDestStore);
    } else {
      setErrorMessage('Failed to update destination store.');
    }
    setIsSaving(false);
  };

  return (
    <div className="form-body">
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
        className="align-self-start"
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
          <Button
            type="button"
            className="btn-submit"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button
            type="button"
            className="btn-cancel"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
        </div>
      )}
      {errorMessage && (
        <Alert variant="danger" className="w-100">
          {errorMessage}
        </Alert>
      )}
    </div>
  );
}
