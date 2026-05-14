import Image from 'next/image';
import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';
import AddInStockToCartForm from '@/app/(main)/request/[storeId]/[storeItemId]/components/AddInStockToCartForm';
import styles from '@/app/(main)/request/[storeId]/[storeItemId]/RequestStoreItemPage.module.css';
import { createClient } from '@/app/lib/supabase/server-client';
import imagePlaceholder from '@/public/image-placeholder.svg';
import { Card, Row, Col } from 'react-bootstrap';
import pinIcon from '@/public/pin-icon.svg';
import cartStyles from '@/app/(main)/request/Cart.module.css';
import cartIcon from '@/public/cart-icon.svg';
import Link from 'next/link';

export default async function RequestStoreItemPage({
  params,
}: {
  params: Promise<{ storeId: string; storeItemId: string }>;
}) {
  const { storeId, storeItemId } = await params;

  const supabase = await createClient();
  const [
    { data: itemData, error: itemError },
    { data: storeData, error: storeError },
  ] = await Promise.all([
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
      <h1>
        <span>Requesting from </span>
        {storeData?.name} <Image src={pinIcon} height={32} alt="Pin icon" />
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
              <div className={styles.fieldGroup}>
                {itemData.quantity_available > 0 ? (
                  <p className={styles.inStock}>
                    {itemData.quantity_available} in Stock
                  </p>
                ) : (
                  <p className={styles.outOfStock}>Out of Stock</p>
                )}
              </div>
              <AddInStockToCartForm
                storeId={storeId}
                storeItemId={storeItemId}
              />
            </Col>
          </Row>
        </div>
      </Card>
      <Link href={`/request/${storeId}/cart`} className={cartStyles.cartButton}>
        <Image src={cartIcon} height={32} alt="Cart icon" />
      </Link>
    </div>
  );
}
