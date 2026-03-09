'use client';

import { useState } from 'react';
import {
  updateCategory,
  updateSubcategory,
  deleteCategory,
  deleteSubcategory,
  createCategory,
  createSubcategory,
} from '@/app/actions/inventory';

type Subcategory = {
  subcategory_id: number;
  name: string;
};

type Category = {
  category_id: number;
  name: string;
  subcategories: Subcategory[];
};

export default function EditCategories({
  categories,
}: {
  categories: Category[];
}) {
  const [editing, setEditing] = useState(false);

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [addingSubcategory, setAddingSubcategory] = useState<number | null>(
    null,
  );
  const [newSubcategoryName, setNewSubcategoryName] = useState('');

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    await createCategory({ name: newCategoryName });
    setNewCategoryName('');
  };

  const handleCreateSubcategory = async (categoryId: number) => {
    if (!newSubcategoryName.trim()) return;

    await createSubcategory({
      name: newSubcategoryName,
      category_id: categoryId,
    });

    setNewSubcategoryName('');
  };

  return (
    <div>
      <button onClick={() => setEditing(!editing)}>
        {editing ? 'Done' : 'Edit'}
      </button>

      {/* Add Category */}
      {editing && (
        <div style={{ marginTop: '1rem' }}>
          <button onClick={() => setShowAddCategory(!showAddCategory)}>
            {showAddCategory ? 'Done' : 'Add'}
          </button>

          {showAddCategory && (
            <div>
              <input
                placeholder="New category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />

              {newCategoryName && (
                <>
                  <button onClick={handleCreateCategory}>Save</button>

                  <button
                    onClick={() => {
                      setNewCategoryName('');
                    }}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      <ul>
        {categories?.map((category) => (
          <li key={category.category_id}>
            {editing ? (
              <EditableField
                id={category.category_id}
                name={category.name}
                type="category"
              />
            ) : (
              category.name
            )}

            {/* Add Subcategory */}
            {editing && (
              <button
                onClick={() =>
                  setAddingSubcategory(
                    addingSubcategory === category.category_id
                      ? null
                      : category.category_id,
                  )
                }
              >
                {addingSubcategory === category.category_id ? 'Done' : 'Add'}
              </button>
            )}

            {editing && addingSubcategory === category.category_id && (
              <div>
                <input
                  placeholder="New subcategory"
                  value={newSubcategoryName}
                  onChange={(e) => setNewSubcategoryName(e.target.value)}
                />

                {newSubcategoryName && (
                  <>
                    <button
                      onClick={() =>
                        handleCreateSubcategory(category.category_id)
                      }
                    >
                      Save
                    </button>

                    <button
                      onClick={() => setNewSubcategoryName('')}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            )}

            <ul>
              {category.subcategories?.map((sub) => (
                <li key={sub.subcategory_id}>
                  {editing ? (
                    <EditableField
                      id={sub.subcategory_id}
                      name={sub.name}
                      type="subcategory"
                    />
                  ) : (
                    sub.name
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EditableField({
  id,
  name,
  type,
}: {
  id: number;
  name: string;
  type: 'category' | 'subcategory';
}) {
  const [value, setValue] = useState(name);
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);

      if (type === 'category') {
        await updateCategory(id, { name: value });
      } else {
        await updateSubcategory(id, { name: value });
      }

      setIsDirty(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);

      if (type === 'category') {
        await deleteCategory(id);
      } else {
        await deleteSubcategory(id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <input
        value={value}
        disabled={loading}
        onChange={(e) => {
          setValue(e.target.value);
          setIsDirty(e.target.value !== name);
        }}
      />

      {isDirty && (
        <>
          <button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>

          <button
            onClick={() => {
              setValue(name);
              setIsDirty(false);
            }}
            disabled={loading}
          >
            Cancel
          </button>
        </>
      )}

      <button onClick={handleDelete} disabled={loading}>
        Remove
      </button>
    </div>
  );
}