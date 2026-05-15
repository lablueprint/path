import Image from 'next/image';
import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';
import DeleteStoreItemButton from '@/app/(main)/manage/[storeId]/[storeItemId]/components/DeleteStoreItemButton';
import StoreItemForm from '@/app/(main)/manage/[storeId]/[storeItemId]/components/StoreItemForm';
import styles from '@/app/(main)/manage/[storeId]/[storeItemId]/ManageStoreItemPage.module.css';
import { createClient } from '@/app/lib/supabase/server-client';
import imagePlaceholder from '@/public/image-placeholder.svg';
import { Card, Row, Col } from 'react-bootstrap';
import pinIcon from '@/public/pin-icon.svg';

export default async function ManageStoreItemPage({
  params,
}: {
  params: Promise<{ storeId: string; storeItemId: string }>;
}) {
  const { storeId, storeItemId } = await params;

  const supabase = await createClient();
  const [{ data: store }, { data: itemData, error: itemError }] =
    await Promise.all([
      supabase.from('stores').select('name').eq('store_id', storeId).single(),
      supabase
        .from('store_items')
        .select(
          `
            store_item_id,
            quantity_available,
            is_hidden,
            inventory_items(
              name,
              description,
              photo_url,
              subcategories(
                name,
                categories(
                  name
                )
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
            is_hidden: boolean;
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
    ]);

  if (itemError || !itemData) {
    console.error('Error fetching store item:', itemError);
    return <div>Failed to load store item.</div>;
  }

  return (
    <div>
      <Breadcrumbs
        labelMap={{
          '/manage': 'Manage Inventory',
          [`/manage/${storeId}`]: store?.name ?? 'Store',
          [`/manage/${storeId}/${storeItemId}`]: itemData.inventory_items.name,
        }}
      />
      <h1>
        <span>Managing </span>
        {store?.name} <Image src={pinIcon} height={32} alt="Pin icon" />
      </h1>
      <Card className="form-card">
        <div className="card-body">
          <Row className="gx-md-5">
            <Col md className="mt-0">
              <div className={styles.photoFrame}>
                <Image
                  src={itemData.inventory_items.photo_url || imagePlaceholder}
                  alt={itemData.inventory_items.name}
                  fill
                  className={styles.photoImage}
                  unoptimized
                />
              </div>
            </Col>

            <Col md className="form-body mt-3 mt-md-0">
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
              <div className={styles.fieldGroup}>
                <p className={styles.fieldLabel}>Description</p>
                <p className={styles.fieldValue}>
                  {itemData.inventory_items.description ||
                    'No description provided.'}
                </p>
              </div>
              <StoreItemForm
                storeId={storeId}
                storeItemId={storeItemId}
                quantity={itemData.quantity_available ?? 0}
                visibility={itemData.is_hidden ?? false}
              />
            </Col>
          </Row>
        </div>
      </Card>

      <DeleteStoreItemButton storeItemId={itemData.store_item_id} />
    </div>
  );
}
