'use client';

import {
  createStore,
  deleteStore,
  createStoreAdmin,
  deleteStoreAdmin,
  createStoreItem,
  deleteStoreItem,
  updateStoreItemIsHidden,
  updateStoreItemQuantity,
  updateStore,
} from '@/app/actions/store';
import {
  StoreInsert,
  StoreAdminInsert,
  StoreItemInsert,
} from '@/app/types/store';

export default function StoresTestComponent() {
  const storeData: StoreInsert = {
    name: 'test store',
    street_address: 'test address',
  };

  const storeAdminData: StoreAdminInsert = {
    user_id: '4f515b9a-cec6-4c85-ab6a-2dab5fb1d884',
    store_id: '5942ab5c-aad1-4f7e-acdc-07a3033b7c6c',
  };

  const storeItemData: StoreItemInsert = {
    inventory_item_id: 'f8434368-0c6a-409f-878a-03cfc7568579',
    store_id: '5942ab5c-aad1-4f7e-acdc-07a3033b7c6c',
    quantity_available: 4,
    is_hidden: true,
  };

  const handleAddStoreClick = async () => {
    await createStore(storeData);
  };

  const handleDeleteStoreClick = async () => {
    await deleteStore('70427a92-803f-43aa-ab38-fa82376cf4cf');
  };

  const handleAddStoreAdminClick = async () => {
    await createStoreAdmin(storeAdminData);
  };

  const handleDeleteStoreAdminClick = async () => {
    await deleteStoreAdmin('035b82ac-80bb-4979-bdda-1db83229a1ee');
  };

  const handleAddStoreItemClick = async () => {
    await createStoreItem(storeItemData);
  };

  const handleDeleteStoreItemClick = async () => {
    await deleteStoreItem('4518b9b5-3401-47ce-b1e4-f09171e0a805');
  };

  const handleUpdateStoreItemQuantity = async () => {
    await updateStoreItemQuantity('4518b9b5-3401-47ce-b1e4-f09171e0a805', 10);
  };

  const handleUpdateStoreItemIsHidden = async () => {
    await updateStoreItemIsHidden(
      '4518b9b5-3401-47ce-b1e4-f09171e0a805',
      false,
    );
  };

  const handleUpdateStore = async () => {
    await updateStore('70427a92-803f-43aa-ab38-fa82376cf4cf', {
      name: 'new store',
    });
  };

  return (
    <div>
      <button onClick={handleAddStoreClick}>Add store</button>
      <button onClick={handleDeleteStoreClick}>Delete store</button>
      <button onClick={handleAddStoreAdminClick}>Add store admin</button>
      <button onClick={handleDeleteStoreAdminClick}>Delete store admin</button>
      <button onClick={handleAddStoreItemClick}>Add store item</button>
      <button onClick={handleDeleteStoreItemClick}>Delete store item</button>
      <button onClick={handleUpdateStoreItemQuantity}>
        Update store item quantity
      </button>
      <button onClick={handleUpdateStoreItemIsHidden}>
        Update store item visibility
      </button>
      <button onClick={handleUpdateStore}>Update store</button>
    </div>
  );
}
