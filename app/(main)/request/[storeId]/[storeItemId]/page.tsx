import { createClient } from '@/app/lib/supabase/server-client';
import AddInStockToCartForm from '@/app/(main)/request/[storeId]/[storeItemId]/components/AddInStockToCartForm';
import Image from 'next/image';
import defaultItemPhoto from '@/public/image-placeholder.svg';

export default async function RequestStoreItemPage({
  params,
}: {
  params: Promise<{ storeId: string; storeItemId: string }>;
}) {
  const { storeId, storeItemId } = await params;

  const supabase = await createClient();

  const { data: itemData, error } = await supabase
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
    >();

  if (error || !itemData) {
    console.error('Error fetching store item:', error);
    return <div>Failed to load data.</div>;
  }

  return (
    <div>
      <Image
        src={itemData.inventory_items.photo_url || defaultItemPhoto}
        alt={itemData.inventory_items.name}
        width={64}
        height={64}
        style={{ objectFit: 'cover' }}
        unoptimized
      />
      <h1>{itemData.inventory_items.name}</h1>
      <p>Description: {itemData.inventory_items.description}</p>
      <p>Category: {itemData.inventory_items.subcategories.categories.name}</p>
      <p>Subcategory: {itemData.inventory_items.subcategories.name}</p>
      <p>Quantity available: {itemData.quantity_available}</p>
      <AddInStockToCartForm storeId={storeId} storeItemId={storeItemId} />
    </div>
  );
}
