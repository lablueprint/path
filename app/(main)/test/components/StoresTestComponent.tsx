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
    user_id: 'e8010a20-b154-44aa-8d42-a1339b92ce1f',
    store_id: '035364a2-e9d5-46da-aadc-e4e8bb1aeebc',
  };

  const storeItemData: StoreItemInsert = {
    inventory_item_id: 'd14c2249-5fcf-4498-a573-f407d2b46b6b',
    store_id: '035364a2-e9d5-46da-aadc-e4e8bb1aeebc',
    quantity_available: 4,
    is_hidden: true,
  };

  const handleAddStoreClick = async () => {
    await createStore(storeData);
  };

  const handleDeleteStoreClick = async () => {
    await deleteStore('0128ff16-54bd-45d8-a0b7-bdf77b0250eb');
  };

  const handleAddStoreAdminClick = async () => {
    await createStoreAdmin(storeAdminData);
  };

  const handleDeleteStoreAdminClick = async () => {
    await deleteStoreAdmin('0b35c60e-f82d-4431-a1a2-8e696c151000');
  };

  const handleAddStoreItemClick = async () => {
    await createStoreItem(storeItemData);
  };

  const handleDeleteStoreItemClick = async () => {
    await deleteStoreItem('3ef33ad7-7e44-4a9f-9926-0aa81fa2c9ee');
  };

  const handleUpdateStoreItemQuantity = async () => {
    await updateStoreItemQuantity('3ef33ad7-7e44-4a9f-9926-0aa81fa2c9ee', 10);
  };

  const handleUpdateStoreItemIsHidden = async () => {
    await updateStoreItemIsHidden('3ef33ad7-7e44-4a9f-9926-0aa81fa2c9ee', true);
  };

  const handleUpdateStore = async () => {
    await updateStore('94221d81-3ee9-495f-9210-b8a754007c14', {
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
