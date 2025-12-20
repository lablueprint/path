'use client';

import { useState } from 'react';
import type { InventoryItemInsert } from '@/app/types/inventory';
import {
  createItem,
  changeItemQuantity,
  deleteItem,
} from '@/app/actions/inventory';

export default function InventoryItemsTestComponent() {
  const [inventoryId, setInventoryId] = useState('');
  const [inventoryIdToDelete, setInventoryIdToDelete] = useState('');
  const [updatedQuantity, setUpdatedQuantity] = useState<number>(0);

  const data: InventoryItemInsert = {
    store_id: '4c7b2b65-16df-44b5-a3c2-e2fcd090b76c',
    subcategory_id: 1,
    item: 'Sample Item',
    description: 'test description',
    photo_url: 'http://example.com/photo.jpg',
    quantity_available: 2,
    is_hidden: false,
  };

  const handleCreateItem = async () => {
    await createItem(data);
  };

  const handleChangeItemQuantity = async () => {
    await changeItemQuantity(inventoryId, Number(updatedQuantity));
  };

  const handleDeleteItem = async () => {
    await deleteItem(inventoryIdToDelete);
  };

  return (
    <div>
      <br />
      <h2>Create an Item</h2>
      <button onClick={handleCreateItem}>Click to add inventory item</button>
      <br />
      <br />
      <h2>Update an Item</h2>
      <div>
        <label>
          Inventory Item ID to Update:
          <input
            type="text"
            value={inventoryId}
            onChange={(e) => setInventoryId(e.target.value)}
            placeholder="inventory_item_id"
          />
        </label>
        <br />
        <label>
          New Quantity:
          <input
            type="number"
            value={updatedQuantity}
            onChange={(e) => setUpdatedQuantity(Number(e.target.value))}
            placeholder="0"
            min={0}
          />
        </label>
        <br />
        <button onClick={handleChangeItemQuantity}>
          Update inventory quantity
        </button>
      </div>
      <br />
      <h2>Delete an Item</h2>
      <div>
        <label>
          Inventory Item ID to Delete:
          <input
            type="text"
            value={inventoryIdToDelete}
            onChange={(e) => setInventoryIdToDelete(e.target.value)}
            placeholder="inventory_item_id"
          />
        </label>
        <br />
        <button onClick={handleDeleteItem}>Delete inventory item</button>
      </div>
      <br />
    </div>
  );
}
