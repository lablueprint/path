import DeleteInventoryItemButton from '@/app/(main)/manage/inventory/[inventoryItemId]/components/DeleteInventoryItemButton';
import EditInventoryItemForm from '@/app/(main)/manage/inventory/[inventoryItemId]/components/EditInventoryItemForm';
import { createClient } from '@/app/lib/supabase/server-client';

export default async function InventoryItemPage({
  params,
}: {
  params: Promise<{ inventoryItemId: string }>;
}) {
  const { inventoryItemId } = await params;
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError) {
    console.error('Error fetching claims:', claimsError);
  }

  const userRole = claimsData?.claims?.user_role;
  const userId = claimsData?.claims?.sub;

  if (!userRole || !userId) {
    return <div>You do not have permission to view this page.</div>;
  }

  if (
    userRole !== 'admin' &&
    userRole !== 'superadmin' &&
    userRole !== 'owner'
  ) {
    return <div>You do not have permission to view this page.</div>;
  }

  const { data, error } = await supabase
    .from('inventory_items')
    .select(
      `inventory_item_id, subcategory_id, name, description, photo_url, subcategories(name, categories(name))`,
    )
    .eq('inventory_item_id', inventoryItemId)
    .single()
    .overrideTypes<
      {
        inventory_item_id: string;
        subcategory_id: number | null;
        name: string;
        description: string;
        photo_url: string | null;
        subcategories: {
          name: string;
          categories: {
            name: string;
          } | null;
        } | null;
      },
      { merge: false }
    >();

  if (error || !data) {
    console.error('Error fetching inventory item:', error);
    return <div>Failed to load inventory item.</div>;
  }

  const item = {
    inventory_item_id: data.inventory_item_id,
    subcategory_id: data.subcategory_id,
    name: data.name,
    description: data.description,
    photo_url: data.photo_url,
  };

  const categoryName = data.subcategories?.categories?.name ?? 'None';
  const subcategoryName = data.subcategories?.name ?? 'None';

  if (userRole === 'admin') {
    return (
      <div>
        <h1>{item.name}</h1>
        <p>Description: {item.description}</p>
        <p>Category: {categoryName}</p>
        <p>Subcategory: {subcategoryName}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>{item.name}</h1>
      {item.photo_url ? (
        <img src={item.photo_url} alt={item.name} width={200} height={200} />
      ) : (
        <p>No photo available.</p>
      )}
      <EditInventoryItemForm item={item} />
      <DeleteInventoryItemButton inventoryItemId={item.inventory_item_id} />
    </div>
  );
}
