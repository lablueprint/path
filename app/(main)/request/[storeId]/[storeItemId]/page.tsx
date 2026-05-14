import Image from 'next/image';
import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';
import AddInStockToCartForm from '@/app/(main)/request/components/AddInStockToCartForm';
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

  let store: { name: string } | null = null;
  if (storeId !== 'all') {
    const { data, error: storeError } = await supabase
      .from('stores')
      .select('name')
      .eq('store_id', storeId)
      .single();

    if (storeError) {
      console.error('Error fetching store for breadcrumbs:', storeError);
    }
    store = data;
  }

  const { data: itemData, error: itemError } = await supabase
    .from('store_items')
    .select(
      `
          stores(store_id, name),
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
        stores: {
          store_id: string;
          name: string;
        };
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
    >();

  if (itemError || !itemData) {
    console.error('Error fetching request page data:', itemError);
    return <div>Failed to load data.</div>;
  }

  const storeName = storeId == 'all' ? 'All Stores' : itemData.stores.name;

  return (
    <div>
      <Breadcrumbs
        labelMap={{
          request: 'Request Inventory',
          [`/request/${storeId}`]: `${storeName}`,
          [`/request/${storeId}/${storeItemId}`]: itemData.inventory_items.name,
        }}
      />
      <h1>
        <span>Requesting from </span>
        {itemData.stores.name}{' '}
        <Image src={pinIcon} height={32} alt="Pin icon" />
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
                storeId={itemData.stores.store_id}
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
