'use client';

import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import styles from '@/app/(main)/manage/categories/components/EditCategories.module.css';
import ViewCategories from '@/app/(main)/manage/categories/components/ViewCategories';

type Category = {
  category_id: number;
  name: string;
  subcategories: {
    name: string;
    subcategory_id: number;
  }[];
};

export default function EditCategories({
  categories,
}: {
  categories: Category[];
}) {
  const [editing, setEditing] = useState(false);

  const updateCategoryName = (categoryId: number, value: string) => {};

  const updateSubcategoryName = (subdategoryId: number, value: string) => {};

  const removeCategory = (categoryId: number) => {};

  const removeSubcategory = (subcategoryId: number) => {};

  const addCategory = () => {};

  const addSubcategory = (categoryId: number) => {};

  return (
    <>
      {editing && (
        <div className="btn-row">
          <Button className="btn-submit" onClick={() => setEditing(false)}>
            Save
          </Button>
          <Button className="btn-cancel" type="button">
            Cancel
          </Button>
        </div>
      )}
      {!editing && (
        <div className="btn-row">
          <Button
            type="button"
            className="btn-submit"
            onClick={() => setEditing(true)}
          >
            Edit
          </Button>
        </div>
      )}
      {editing && (
        <Button className="btn-submit align-self-start" onClick={addCategory}>
          Add Category
        </Button>
      )}
      {editing ? (
        categories.map((category) => (
          <div key={category.category_id} className="gap-container">
            <div className={styles.categoryRow}>
              <Form.Control
                type="text"
                value={category.name}
                onChange={(e) =>
                  updateCategoryName(category.category_id, e.target.value)
                }
                className={styles.inputField}
              />

              <Button
                variant="outline-danger"
                className="btn-remove"
                onClick={() => removeCategory(category.category_id)}
              >
                Remove
              </Button>
            </div>

            <div className={styles.subcategoryList}>
              <div>
                <Button
                  className="btn-submit"
                  onClick={() => addSubcategory(category.category_id)}
                >
                  Add Subcategory
                </Button>
              </div>
              {category.subcategories.map((subcategory) => (
                <div
                  key={subcategory.subcategory_id}
                  className={styles.subcategoryRow}
                >
                  <Form.Control
                    type="text"
                    value={subcategory.name}
                    onChange={(e) =>
                      updateSubcategoryName(
                        subcategory.subcategory_id,
                        e.target.value,
                      )
                    }
                    className={styles.inputField}
                  />

                  <Button
                    variant="outline-danger"
                    className="btn-remove"
                    onClick={() =>
                      removeSubcategory(subcategory.subcategory_id)
                    }
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <ViewCategories categories={categories} />
      )}
    </>
  );
}
