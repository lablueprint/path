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

  const { data, error } = await supabase
    .from('inventory_items')
    .select(
      `
        inventory_item_id,
        subcategory_id,
        name,
        description,
        photo_url,
        subcategories(name, 
        category_id, categories(name))
      `,
    )
    .eq('inventory_item_id', inventoryItemId)
    .single()
    .overrideTypes<
      {
        inventory_item_id: string;
        subcategory_id: number;
        name: string;
        description: string;
        photo_url: string | null;
        subcategories: {
          name: string;
          category_id: string;
          categories: {
            name: string;
          };
        };
      },
      { merge: false }
    >();

  if (error || !data) {
    console.error('Error fetching inventory item:', error);
    return <div>Failed to load inventory item.</div>;
  }

  const [categoriesRes, subcategoriesRes] = await Promise.all([
    supabase.from('categories').select('*'),
    supabase
      .from('subcategories')
      .select('*')
      .eq('category_id', data.subcategories?.category_id),
  ]);

  const item = {
    inventory_item_id: data.inventory_item_id,
    subcategory_id: Number(data.subcategory_id),
    name: data.name,
    description: data.description,
    photo_url: data.photo_url,
    category_id: data.subcategories?.category_id,
  };

  const categoryName = data.subcategories?.categories?.name ?? 'None';
  const subcategoryName = data.subcategories?.name ?? 'None';

  if (userRole !== 'superadmin' && userRole !== 'owner') {
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
      <EditInventoryItemForm
        item={item}
        initialCategories={categoriesRes.data || []}
        initialSubcategories={subcategoriesRes.data || []}
      />
      <DeleteInventoryItemButton inventoryItemId={item.inventory_item_id} />
    </div>
  );
}
