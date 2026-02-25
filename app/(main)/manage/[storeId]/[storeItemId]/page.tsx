import { createClient } from '@/app/lib/supabase/server-client';
import StoreItemForm from '@/app/(main)/manage/[storeId]/[storeItemId]/components/StoreItemForm';

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
    .eq('store_item_id', storeItemId)
    .single();
  if (itemError || !itemData) {
    console.error('Error fetching store item:', itemError);
    return <div>Failed to load store item.</div>;
  }

  return (
    <div>
      <h1>{(itemData.inventory_items as any).name}</h1>
      <p>Description: {(itemData.inventory_items as any).description}</p>
      <p>
        Category:{' '}
        {(itemData.inventory_items as any).subcategories.categories.name}
      </p>
      <p>Subcategory: {(itemData.inventory_items as any).subcategories.name}</p>
      <StoreItemForm
        storeId={storeId}
        storeItemId={storeItemId}
        quantity={itemData.quantity_available ?? 0}
        visibility={itemData.is_hidden ?? false}
      />
    </div>
  );
}
