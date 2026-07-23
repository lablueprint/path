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
import { Button, Form, Alert } from 'react-bootstrap';
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
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addingSubcategory, setAddingSubcategory] = useState<number | null>(
    null,
  );
  const [newSubcategoryName, setNewSubcategoryName] = useState('');

  const handleCreateCategory = async () => {
    setErrorMessage('');
    try {
      setLoading(true);
      if (!newCategoryName.trim()) return;

      const categoryResult = await createCategory({ name: newCategoryName });
      if (!categoryResult.success) {
        setErrorMessage('Failed to save category: ' + categoryResult.error);
      }
      setNewCategoryName('');
      setShowAddCategory(false);
    } catch {
      setErrorMessage('Failed to save category.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubcategory = async (categoryId: number) => {
    setErrorMessage('');
    try {
      setLoading(true);
      if (!newSubcategoryName.trim()) return;

      const subcategoryResult = await createSubcategory({
        name: newSubcategoryName,
        category_id: Number(categoryId),
      });
      if (!subcategoryResult.success) {
        setErrorMessage('Failed to save category: ' + subcategoryResult.error);
      }
      setNewSubcategoryName('');
      setAddingSubcategory(null);
    } catch {
      setErrorMessage('Failed to save subcategory.');
    } finally {
      setLoading(false);
    }
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
        <ul className="mb-0 gap-container">
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
                <Button
                  className="btn-submit"
                  onClick={handleCreateCategory}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
                </Button>
              )}
              <Button
                className="btn-cancel"
                onClick={() => {
                  setNewCategoryName('');
                  setShowAddCategory(false);
                }}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </li>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
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
                  <ul className="mb-0 gap-container">
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
                            disabled={loading}
                          >
                            {loading ? 'Saving...' : 'Save'}
                          </Button>
                        )}
                        <Button
                          className="btn-cancel"
                          onClick={() => {
                            setNewSubcategoryName('');
                            setAddingSubcategory(null);
                          }}
                          disabled={loading}
                        >
                          Cancel
                        </Button>
                      </div>
                    </li>
                    {errorMessage && (
                      <Alert variant="danger">{errorMessage}</Alert>
                    )}
                  </ul>
                )}

                {category.subcategories.length > 0 ? (
                  <ul className="mb-0 gap-container">
                    {category.subcategories.map((sub) => (
                      <li key={sub.subcategory_id}>
                        <div className="gap-container">
                          {editing ? (
                            <EditableField
                              id={sub.subcategory_id}
                              name={sub.name}
                              type="subcategory"
                            />
                          ) : (
                            sub.name
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No subcategories found.</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No categories found.</p>
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
  const [errorMessage, setErrorMessage] = useState('');

  const handleSave = async () => {
    setErrorMessage('');
    try {
      setLoading(true);

      if (type === 'category') {
        const categoryResult = await updateCategory(id, { name: value });
        if (!categoryResult.success) {
          setErrorMessage('Failed to update category: ' + categoryResult.error);
        }
      } else {
        const subcategoryResult = await updateSubcategory(id, { name: value });
        if (!subcategoryResult.success) {
          setErrorMessage(
            'Failed to update subcategory: ' + subcategoryResult.error,
          );
        }
      }

      setIsDirty(false);
    } catch (err) {
      setErrorMessage('Failed to update ' + type + ': ' + err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setErrorMessage('');
    try {
      setLoading(true);

      if (type === 'category') {
        const categoryResult = await deleteCategory(id);
        if (!categoryResult.success) {
          setErrorMessage(
            categoryResult.error?.includes('foreign key constraint')
              ? 'Failed to remove category because there are still subcategories associated with it.'
              : 'Failed to remove category: ' + categoryResult.error,
          );
        }
      } else {
        const subcategoryResult = await deleteSubcategory(id);
        if (!subcategoryResult.success) {
          setErrorMessage(
            subcategoryResult.error?.includes('foreign key constraint')
              ? 'Failed to remove subcategory because there are still inventory items associated with it.'
              : 'Failed to remove subcategory: ' + subcategoryResult.error,
          );
        }
      }
    } catch (err) {
      setErrorMessage('Failed to delete ' + type + ': ' + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="btn-row">
        <Form.Control
          type="text"
          value={value}
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
          {loading ? 'Removing...' : 'Remove'}
        </Button>
      </div>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
    </>
  );
}
