'use client';

import Form from 'next/form';
import { addToCart } from '@/app/actions/ticket';
import styles from './AddInStockToCartForm.module.css';

interface AddInStockToCartFormProps {
  storeId: string;
  storeItemId: string;
  storeName: string;
  itemName: string;
  categoryName: string;
  subcategoryName: string;
  description: string;
  photoUrl: string | null;
  quantityAvailable: number;
}

export default function AddInStockToCartForm({
  storeId,
  storeItemId,
  storeName,
  itemName,
  categoryName,
  subcategoryName,
  description,
  photoUrl,
  quantityAvailable,
}: AddInStockToCartFormProps) {
  const handleSubmit = async (formData: FormData) => {
    const actualQuantity = Number(formData.get('quantity'));
    const { error: err } = await addToCart(
      storeId,
      storeItemId,
      actualQuantity,
    );
    if (err) {
      console.error('Error fetching ticket:', err);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h1>
        Requesting from <span className={styles.locationName}>{storeName}</span>
      </h1>

      <Form action={handleSubmit} className={styles.card}>
        <div className={styles.content}>
          <div className={styles.mediaColumn}>
            <div className={styles.photoFrame}>
              {photoUrl ? (
                <div
                  className={styles.photoImage}
                  style={{ backgroundImage: `url("${photoUrl}")` }}
                  role="img"
                  aria-label={itemName}
                />
              ) : (
                <div className={styles.placeholderImage} aria-hidden="true" />
              )}
            </div>
          </div>

          <div className={styles.detailsColumn}>
            <div className={styles.fieldGroup}>
              <p className={styles.fieldLabel}>Name</p>
              <p className={styles.fieldValue}>{itemName}</p>
            </div>

            <div className={styles.fieldGroup}>
              <p className={styles.fieldLabel}>Category</p>
              <p className={styles.fieldValue}>{categoryName}</p>
            </div>

            <div className={styles.fieldGroup}>
              <p className={styles.fieldLabel}>Subcategory</p>
              <p className={styles.fieldValue}>{subcategoryName}</p>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="quantity">
                Quantity
              </label>
              <div className={styles.quantityRow}>
                <input
                  id="quantity"
                  className={styles.quantityInput}
                  name="quantity"
                  type="number"
                  min={1}
                  step={1}
                  placeholder="###"
                  required
                />
                <span className={styles.stockBadge}>
                  {quantityAvailable} in Stock
                </span>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <p className={styles.fieldLabel}>Description</p>
              <p className={styles.descriptionText}>
                {description || 'No description provided.'}
              </p>
            </div>

            <button type="submit" className={styles.addButton}>
              Add to Cart
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
}
