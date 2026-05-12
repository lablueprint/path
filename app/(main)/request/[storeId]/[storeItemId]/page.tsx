import Image from 'next/image';
import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';
import AddInStockToCartForm from '@/app/(main)/request/[storeId]/[storeItemId]/components/AddInStockToCartForm';
import styles from '@/app/(main)/request/[storeId]/[storeItemId]/components/AddInStockToCartForm.module.css';
import { createClient } from '@/app/lib/supabase/server-client';
import imagePlaceholder from '@/public/image-placeholder.svg';

export default async function RequestStoreItemPage({
  params,
}: {
  params: Promise<{ storeId: string; storeItemId: string }>;
}) {
  const { storeId, storeItemId } = await params;

  const supabase = await createClient();
  const [{ data: itemData, error: itemError }, { data: storeData, error: storeError }] =
    await Promise.all([
      supabase
        .from('store_items')
        .select(
          `
            store_item_id,
            quantity_available,
            inventory_items(name, description, photo_url,
              subcategories(name,
                  categories(name)
              )
            )
          `,
        )
        .eq('store_item_id', storeItemId)
        .single()
        .overrideTypes<
          {
            store_item_id: string;
            quantity_available: number;
            inventory_items: {
              name: string;
              description: string;
              photo_url: string | null;
              subcategories: {
                name: string;
                categories: {
                  name: string;
                };
              };
            };
          },
          { merge: false }
        >(),
      supabase
        .from('stores')
        .select('name')
        .eq('store_id', storeId)
        .single()
        .overrideTypes<{ name: string }, { merge: false }>(),
    ]);

  if (itemError || !itemData || storeError || !storeData) {
    console.error('Error fetching request page data:', itemError || storeError);
    return <div>Failed to load data.</div>;
  }

  return (
    <div>
      <Breadcrumbs
        labelMap={{
          request: 'Request Inventory',
          [`/request/${storeId}`]: storeData.name,
          [`/request/${storeId}/${storeItemId}`]: itemData.inventory_items.name,
        }}
      />

      <div className={styles.wrapper}>
        <h1>
          Requesting from{' '}
          <span className={styles.locationName}>{storeData.name}</span>
        </h1>

        <div className={styles.card}>
          <div className={styles.content}>
            <div className={styles.mediaColumn}>
              <div className={styles.photoFrame}>
                <Image
                  src={itemData.inventory_items.photo_url || imagePlaceholder}
                  alt={itemData.inventory_items.name}
                  fill
                  className={styles.photoImage}
                  sizes="392px"
                  unoptimized
                />
              </div>
            </div>

            <div className={styles.detailsColumn}>
              <div className={styles.fieldGroup}>
                <p className={styles.fieldLabel}>Name</p>
                <p className={styles.fieldValue}>
                  {itemData.inventory_items.name}
                </p>
              </div>

              <div className={styles.fieldGroup}>
                <p className={styles.fieldLabel}>Category</p>
                <p className={styles.fieldValue}>
                  {itemData.inventory_items.subcategories.categories.name}
                </p>
              </div>

              <div className={styles.fieldGroup}>
                <p className={styles.fieldLabel}>Subcategory</p>
                <p className={styles.fieldValue}>
                  {itemData.inventory_items.subcategories.name}
                </p>
              </div>

              <AddInStockToCartForm
                storeId={storeId}
                storeItemId={storeItemId}
              />

              <p className={styles.stockBadge}>
                {itemData.quantity_available} in Stock
              </p>

              <div className={styles.fieldGroup}>
                <p className={styles.fieldLabel}>Description</p>
                <p className={styles.descriptionText}>
                  {itemData.inventory_items.description ||
                    'No description provided.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
