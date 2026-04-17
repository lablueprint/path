import { createClient } from '@/app/lib/supabase/server-client';
import StoreItemForm from '@/app/(main)/manage/[storeId]/[storeItemId]/components/StoreItemForm';
import DeleteStoreItemButton from '@/app/(main)/manage/[storeId]/[storeItemId]/components/DeleteStoreItemButton';
import StoreItemDetailPanel, {
  StoreItemDetailField,
  StoreItemDetailGrid,
} from '@/app/(main)/components/StoreItemDetailPanel';
import styles from '@/app/(main)/manage/[storeId]/[storeItemId]/ManageStoreItemPage.module.css';

export default async function ManageStoreItemPage({
  params,
}: {
  params: Promise<{ storeId: string; storeItemId: string }>;
}) {
  const { storeId, storeItemId } = await params;

  const supabase = await createClient();
  const { data: itemData, error: itemError } = await supabase
    .from('store_items')
    .select(
      `
        store_item_id,
        quantity_available,
        is_hidden,
        inventory_items(name, description, photo_url,
          subcategories(name,
              categories(name)
          )
        )
      `,
    )
    .eq('store_id', storeId)
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
    >();
  if (itemError || !itemData) {
    console.error('Error fetching store item:', itemError);
    return <div>Failed to load store item.</div>;
  }

  const item = itemData.inventory_items;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Edit</h1>
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
          <StoreItemDetailField label="Description" fullWidth>
            {item.description || 'No description provided.'}
          </StoreItemDetailField>
        </StoreItemDetailGrid>

        <StoreItemForm
          storeId={storeId}
          storeItemId={storeItemId}
          quantity={itemData.quantity_available ?? 0}
          visibility={itemData.is_hidden ?? false}
        />

        <DeleteStoreItemButton storeItemId={itemData.store_item_id} />
      </StoreItemDetailPanel>
    </div>
  );
}
