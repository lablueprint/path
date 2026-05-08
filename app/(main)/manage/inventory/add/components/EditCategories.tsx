'use client';

import styles from './EditCategories.module.css';
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
  subcategories: {
    subcategory_id: number;
    name: string;
  }[];
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
    <div className={styles.pageContainer}>
      <div className={styles.topButtons}>
        <button
          className={styles.primaryButton}
          onClick={() => setEditing(!editing)}
        >
          {editing ? 'Done' : 'Edit'}
        </button>
      </div>

      {/* Add Category */}
      {editing && (
        <div className={styles.addSection}>
          <button
            className={styles.primaryButton}
            onClick={() => setShowAddCategory(!showAddCategory)}
          >
            {showAddCategory ? 'Done' : 'Add'}
          </button>

          {showAddCategory && (
            <div className={styles.buttonGroup}>
              <input
                placeholder="New category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className={styles.inputField}
              />

              {newCategoryName && (
                <>
                  <button
                    className={styles.secondaryButton}
                    onClick={handleCreateCategory}
                  >
                    Save
                  </button>

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

      <ul className={styles.categoriesContainer}>
        {categories?.map((category) => (
          <li
            key={category.category_id}
            className={styles.categoryBlock}
          >
            <div className={styles.categoryRow}>
              {editing ? (
                <EditableField
                  id={category.category_id}
                  name={category.name}
                  type="category"
                />
              ) : (
                <p className="fw-semibold mb-0">{category.name}</p>
              )}

              {/* Add Subcategory */}
              {editing && (
                <button
                  className={styles.primaryButton}
                  onClick={() =>
                    setAddingSubcategory(
                      addingSubcategory === category.category_id
                        ? null
                        : category.category_id,
                    )
                  }
                >
                  {addingSubcategory === category.category_id
                    ? 'Done'
                    : 'Add'}
                </button>
              )}
            </div>

            {editing && addingSubcategory === category.category_id && (
              <div className={styles.addSection}>
                <div className={styles.buttonGroup}>
                  <input
                    placeholder="New subcategory"
                    value={newSubcategoryName}
                    onChange={(e) => setNewSubcategoryName(e.target.value)}
                    className={styles.inputField}
                  />

                  {newSubcategoryName && (
                    <>
                      <button
                        className={styles.secondaryButton}
                        onClick={() =>
                          handleCreateSubcategory(category.category_id)
                        }
                      >
                        Save
                      </button>

                      <button onClick={() => setNewSubcategoryName('')}>
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            <ul className={styles.subcategoryList}>
              {category.subcategories?.map((sub) => (
                <li
                  key={sub.subcategory_id}
                  className={styles.subcategoryRow}
                >
                  {editing ? (
                    <EditableField
                      id={sub.subcategory_id}
                      name={sub.name}
                      type="subcategory"
                    />
                  ) : (
                    <p className="mb-0">{sub.name}</p>
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
    <div className={styles.buttonGroup}>
      <input
        value={value}
        disabled={loading}
        className={styles.inputField}
        onChange={(e) => {
          setValue(e.target.value);
          setIsDirty(e.target.value !== name);
        }}
      />

      {isDirty && (
        <>
          <button
            className={styles.secondaryButton}
            onClick={handleSave}
            disabled={loading}
          >
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

      <button
        className={styles.removeButton}
        onClick={handleDelete}
        disabled={loading}
      >
        Remove
      </button>
    </div>
  );
}