'use client';

import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

import styles from './EditCategories.module.css';

type Category = {
  name: string;
  subcategories: string[];
};

const initialCategories: Category[] = [
  {
    name: 'Cleaning',
    subcategories: ['Laundry', 'Surface Cleaners'],
  },
  {
    name: 'Clothing',
    subcategories: ['Menswear', 'Womenswear'],
  },
  {
    name: 'Food',
    subcategories: ['Beverages', 'Dry goods', 'Produce'],
  },
  {
    name: 'Home Goods',
    subcategories: ['Bedding', 'Kitchenware'],
  },
  {
    name: 'Hygiene',
    subcategories: [],
  },
];

export default function EditCategories() {
  const [editing, setEditing] = useState(false);

  const [categories, setCategories] =
    useState<Category[]>(initialCategories);

  const updateCategoryName = (
    categoryIndex: number,
    value: string
  ) => {
    const updated = [...categories];

    updated[categoryIndex].name = value;

    setCategories(updated);
  };

  const updateSubcategoryName = (
    categoryIndex: number,
    subcategoryIndex: number,
    value: string
  ) => {
    const updated = [...categories];

    updated[categoryIndex].subcategories[subcategoryIndex] =
      value;

    setCategories(updated);
  };

  const removeCategory = (categoryIndex: number) => {
    setCategories(
      categories.filter((_, i) => i !== categoryIndex)
    );
  };

  const removeSubcategory = (
    categoryIndex: number,
    subcategoryIndex: number
  ) => {
    const updated = [...categories];

    updated[categoryIndex].subcategories =
      updated[categoryIndex].subcategories.filter(
        (_, i) => i !== subcategoryIndex
      );

    setCategories(updated);
  };

  const addCategory = () => {
    setCategories([
      ...categories,
      {
        name: '',
        subcategories: [],
      },
    ]);
  };

  const addSubcategory = (categoryIndex: number) => {
    const updated = [...categories];

    updated[categoryIndex].subcategories.push('');

    setCategories(updated);
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}></h1>

      {editing && (
        <p className={styles.subtitle}>
          Manage inventory categories and subcategories
        </p>
      )}

      <div className={styles.topButtons}>
        {editing ? (
          <Button
            className="btn-submit"
            onClick={() => setEditing(false)}
          >
            Save Changes
          </Button>
        ) : (
          <Button
            className="btn-submit"
            onClick={() => setEditing(true)}
          >
            Edit
          </Button>
        )}
      </div>

      <div className={styles.categoriesContainer}>
        {editing && (
          <Button
            className="btn-submit align-self-start"
            onClick={addCategory}
          >
            Add Category
          </Button>
        )}

        {categories.map((category, categoryIndex) => (
          <div
            key={categoryIndex}
            className={styles.categoryBlock}
          >
            {editing ? (
              <>
                <div className={styles.categoryRow}>
                  <Form.Control
                    type="text"
                    value={category.name}
                    onChange={(e) =>
                      updateCategoryName(
                        categoryIndex,
                        e.target.value
                      )
                    }
                    className={styles.inputField}
                  />

                  <Button
                    variant="outline-danger"
                    className="btn-remove"
                    onClick={() =>
                      removeCategory(categoryIndex)
                    }
                  >
                    Remove
                  </Button>
                </div>

                <div className={styles.subcategoryList}>
                  {category.subcategories.map(
                    (subcategory, subcategoryIndex) => (
                      <div
                        key={subcategoryIndex}
                        className={
                          styles.subcategoryRow
                        }
                      >
                        <Form.Control
                          type="text"
                          value={subcategory}
                          onChange={(e) =>
                            updateSubcategoryName(
                              categoryIndex,
                              subcategoryIndex,
                              e.target.value
                            )
                          }
                          className={
                            styles.inputField
                          }
                        />

                        <Button
                          variant="outline-danger"
                          className="btn-remove"
                          onClick={() =>
                            removeSubcategory(
                              categoryIndex,
                              subcategoryIndex
                            )
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    )
                  )}

                  <div className={styles.addSection}>
                    <Button
                      className="btn-submit"
                      onClick={() =>
                        addSubcategory(categoryIndex)
                      }
                    >
                      Add Subcategory
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h3>{category.name}</h3>

                <div className={styles.subcategoryList}>
                  {category.subcategories.map(
                    (subcategory, subcategoryIndex) => (
                      <p key={subcategoryIndex}>
                        {subcategory}
                      </p>
                    )
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}