import { createClient } from '@/app/lib/supabase/server-client';
import AddInStockToCartForm from '@/app/(main)/request/[storeId]/[storeItemId]/components/AddInStockToCartForm';
import StoreItemDetailPanel, {
  StoreItemDetailField,
  StoreItemDetailGrid,
} from '@/app/(main)/components/StoreItemDetailPanel';
import styles from '@/app/(main)/request/[storeId]/[storeItemId]/RequestStoreItemPage.module.css';

function LocationIcon() {
  return (
    <span className={styles.icon} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
        <path
          d="M12 21C15.5 17.4 19 14.3 19 10.5C19 6.9 15.9 4 12 4C8.1 4 5 6.9 5 10.5C5 14.3 8.5 17.4 12 21Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="12"
          cy="10.5"
          r="2.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    </span>
  );
}

export default async function RequestStoreItemPage({
  params,
}: {
  params: Promise<{ storeId: string; storeItemId: string }>;
}) {
  const { storeId, storeItemId } = await params;

  const supabase = await createClient();

  const [itemResult, storeResult] = await Promise.all([
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
      .eq('store_id', storeId)
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
      .select('name, street_address')
      .eq('store_id', storeId)
      .single(),
  ]);

  const { data: itemData, error } = itemResult;
  const { data: storeData, error: storeError } = storeResult;

  if (error || !itemData || storeError || !storeData) {
    console.error(
      'Error fetching request item page data:',
      error ?? storeError,
    );
    return <div>Failed to load data.</div>;
  }

  const item = itemData.inventory_items;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <span>Requesting from</span>
          <span className={styles.location}>
            <span>&quot;{storeData.name}&quot;</span>
            <LocationIcon />
          </span>
        </h1>
        <p className={styles.address}>{storeData.street_address}</p>
      </header>

      <StoreItemDetailPanel itemName={item.name} photoUrl={item.photo_url}>
        <StoreItemDetailGrid>
          <StoreItemDetailField label="Name">{item.name}</StoreItemDetailField>
          <StoreItemDetailField label="Category">
            {item.subcategories.categories.name}
          </StoreItemDetailField>
          <StoreItemDetailField label="Subcategory">
            {item.subcategories.name}
          </StoreItemDetailField>
          <StoreItemDetailField label="Quantity Available">
            {itemData.quantity_available}
          </StoreItemDetailField>
          <StoreItemDetailField label="Description" fullWidth>
            {item.description || 'No description provided.'}
          </StoreItemDetailField>
        </StoreItemDetailGrid>

        <AddInStockToCartForm storeId={storeId} storeItemId={storeItemId} />
      </StoreItemDetailPanel>
    </div>
  );
}
