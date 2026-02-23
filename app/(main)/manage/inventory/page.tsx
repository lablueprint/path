import InventoryItemCard from '@/app/(main)/manage/inventory/components/InventoryItemCard';
import { createClient } from '@/app/lib/supabase/server-client';

export default async function InventoryPage() {
  const supabase = await createClient();

  const { data: itemsData, error: itemError } = await supabase
    .from('inventory_items')
    .select(
      `inventory_item_id, name, photo_url, subcategories(name, categories(name))`,
    );
  if (itemError) {
    console.error(itemError);
    return <div>Failed to load inventory items.</div>;
  }

  const { data: categories, error } = await supabase
    .from('categories')
    .select(`category_id, name, subcategories(subcategory_id, name)`)
    .order('name', { ascending: true })
    .order('name', { referencedTable: 'subcategories', ascending: true });
  if (error) {
    console.error(error);
    return <div>Failed to load categories.</div>;
  }

  const items = itemsData?.map((item) => ({
    inventory_item_id: item.inventory_item_id as string,
    item: item.name as string,
    photo_url: item.photo_url as string,
    subcategory: (item.subcategories as any).name as string,
    category: (item.subcategories as any).categories.name as string,
  }));

  return (
    <div>
      <h1>Library</h1>
      <h2>Items</h2>
      <div>
        {items?.map((item) => (
          <div key={item.inventory_item_id}>
            <InventoryItemCard
              inventory_item_id={item.inventory_item_id}
              item={item.item}
              photo_url={item.photo_url}
              subcategory={item.subcategory}
              category={item.category}
            />
          </div>
        ))}
      </div>
      <h2>Categories</h2>
      <ul>
        {categories?.map((cat) => (
          <li key={cat.category_id}>
            {cat.name}
            <ul>
              {cat.subcategories?.map((sub) => (
                <li key={sub.subcategory_id}>{sub.name}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
