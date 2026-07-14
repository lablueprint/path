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
import { Button, Form } from 'react-bootstrap';
import styles from '@/app/(main)/manage/categories/components/EditCategories.module.css';

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
    setShowAddCategory(false);
  };

  const handleCreateSubcategory = async (categoryId: number) => {
    if (!newSubcategoryName.trim()) return;

    await createSubcategory({
      name: newSubcategoryName,
      category_id: Number(categoryId),
    });

    setNewSubcategoryName('');
    setAddingSubcategory(null);
  };

  return (
    <>
      <Button
        className="btn-submit align-self-start"
        onClick={() => setEditing(!editing)}
      >
        {editing ? 'Done' : 'Edit'}
      </Button>

      {/* Add Category */}
      {editing && !showAddCategory && (
        <Button
          className="btn-submit align-self-start"
          onClick={() => setShowAddCategory(true)}
        >
          Add Category
        </Button>
      )}

      {editing && showAddCategory && (
        <ul className="mb-0">
          <li>
            <div className="btn-row">
              <Form.Control
                type="text"
                placeholder="New Category Name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className={styles.inputField}
              />

              {newCategoryName && (
                <Button className="btn-submit" onClick={handleCreateCategory}>
                  Save
                </Button>
              )}
              <Button
                className="btn-cancel"
                onClick={() => {
                  setNewCategoryName('');
                  setShowAddCategory(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </li>
        </ul>
      )}

      {categories.length > 0 ? (
        <ul className="mb-0 gap-container">
          {categories.map((category) => (
            <li key={category.category_id}>
              <div className="gap-container">
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
                {editing && addingSubcategory != category.category_id && (
                  <Button
                    className="btn-submit align-self-start"
                    onClick={() => {
                      setAddingSubcategory(category.category_id);
                      setNewSubcategoryName('');
                    }}
                  >
                    Add Subcategory
                  </Button>
                )}

                {editing && addingSubcategory === category.category_id && (
                  <ul className="mb-0">
                    <li>
                      <div className="btn-row">
                        <Form.Control
                          type="text"
                          placeholder="New Subcategory Name"
                          value={newSubcategoryName}
                          onChange={(e) =>
                            setNewSubcategoryName(e.target.value)
                          }
                          className={styles.inputField}
                        />
                        {newSubcategoryName && (
                          <Button
                            className="btn-submit"
                            onClick={() =>
                              handleCreateSubcategory(category.category_id)
                            }
                          >
                            Save
                          </Button>
                        )}
                        <Button
                          className="btn-cancel"
                          onClick={() => {
                            setNewSubcategoryName('');
                            setAddingSubcategory(null);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </li>
                  </ul>
                )}

                {category.subcategories.length > 0 ? (
                  <ul className="mb-0 gap-container">
                    {category.subcategories.map((sub) => (
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
                ) : (
                  <div>No subcategories found.</div>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div>No categories found.</div>
      )}
    </>
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
    <div className="btn-row">
      <Form.Control
        type="text"
        value={value}
        disabled={loading}
        onChange={(e) => {
          setValue(e.target.value);
          setIsDirty(e.target.value !== name);
        }}
        className={styles.inputField}
      />

      {isDirty && (
        <>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="btn-submit"
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>

          <Button
            onClick={() => {
              setValue(name);
              setIsDirty(false);
            }}
            disabled={loading}
            className="btn-cancel"
          >
            Cancel
          </Button>
        </>
      )}

      <Button
        variant="outline-danger"
        onClick={handleDelete}
        disabled={loading}
        className="btn-remove"
      >
        Remove
      </Button>
    </div>
  );
}
