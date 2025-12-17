'use client';

import { createStore, deleteStore } from '@/app/api/stores/actions';
import { StoreInsert } from '@/app/types/store';

export default function StoresTestComponent() {
  const storeData: StoreInsert = {
    name: 'test store',
    street_address: 'test address',
  };

  const handleAddStoreClick = async () => {
    await createStore(storeData);
  };

  const handleDeleteStoreClick = async () => {
    await deleteStore('ea9a0fac-c881-4740-894c-34139859a057');
  };

  return (
    <div>
      <button onClick={handleAddStoreClick}>
        Click to add store to stores table
      </button>
      <button onClick={handleDeleteStoreClick}>
        Click to delete store from stores table
      </button>
    </div>
  );
}
