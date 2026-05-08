'use client';

import { useState } from 'react';
import type { SubcategoryInsert } from '@/app/types/inventory';
import {
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from '@/app/actions/inventory';

export default function CategoriesTestComponent() {
  const data: SubcategoryInsert = {
    category_id: 1,
    name: 'sample subcategory',
  };

  const [subcategoryId, setSubcategoryId] = useState('');
  const [updatedName, setUpdatedName] = useState('');
  const [deleteSubcategoryId, setDeleteSubcategoryId] = useState('');

  const handleCreateSubcategory = async () => {
    const result = await createSubcategory(data);
    console.log('Create Subcategory Result:', result);
  };

  const handleUpdateSubcategory = async () => {
    const result = await updateSubcategory(Number(subcategoryId), {
      name: updatedName,
    });
    console.log('Update Subcategory Result:', result);
  };

  const handleDeleteSubcategory = async () => {
    const result = await deleteSubcategory(Number(deleteSubcategoryId));
    console.log('Delete Subcategory Result:', result);
  };

  return (
    <div>
      <br />
      <h2>Create a Subcategory</h2>
      <button onClick={handleCreateSubcategory}>
        Click to add subcategory
      </button>
      <br />
      <br />
      <h2>Update a Subcategory</h2>
      <div>
        <label>
          Subcategory ID to Update:
          <input
            type="text"
            value={subcategoryId}
            onChange={(e) => setSubcategoryId(e.target.value)}
            placeholder="subcategory_id"
          />
        </label>
        <br />
        <label>
          New Name:
          <input
            type="text"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
            placeholder="new subcategory name"
          />
        </label>
        <br />
        <button onClick={handleUpdateSubcategory}>Update subcategory</button>
      </div>
      <br />
      <h2>Delete a Subcategory</h2>
      <div>
        <label>
          Subcategory ID to Delete:
          <input
            type="text"
            value={deleteSubcategoryId}
            onChange={(e) => setDeleteSubcategoryId(e.target.value)}
            placeholder="subcategory_id"
          />
        </label>
        <br />
        <button onClick={handleDeleteSubcategory}>Delete subcategory</button>
      </div>
      <br />
    </div>
  );
}
