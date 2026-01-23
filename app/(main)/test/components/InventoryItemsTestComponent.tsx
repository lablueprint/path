'use client';

import { useState } from 'react';
import type { InventoryItemInsert } from '@/app/types/inventory';
import { createItem, updateItem, deleteItem } from '@/app/actions/inventory';

export default function InventoryItemsTestComponent() {
  const [inventoryId, setInventoryId] = useState('');
  const [inventoryIdToDelete, setInventoryIdToDelete] = useState('');
  const [updatedQuantity, setUpdatedQuantity] = useState<number>(0);

  const data: InventoryItemInsert = {
    subcategory_id: 1,
    name: 'test name',
    description: 'test description',
    photo_url: 'http://example.com/photo.jpg',
  };

  const handleCreateItem = async () => {
    try {
      const result = await createItem(data);
      console.log('Created item:', result);
    } catch (err) {
      console.error('Create item failed:', err);
    }
  };

  const handleUpdateItem = async () => {
    await updateItem(inventoryId, {
      name: 'new name',
      description: 'new description',
    });
  };

  const handleDeleteItem = async () => {
    try {
      const result = await deleteItem(inventoryIdToDelete);
      console.log('Deleted item:', result);
    } catch (err) {
      console.error('Delete item failed:', err);
    }
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
        <button onClick={handleUpdateItem}>Update inventory item</button>
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
