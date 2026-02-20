import InventoryItemCard from '@/app/(main)/manage/inventory/components/InventoryItemCard';
import { createClient } from '@/app/lib/supabase/server-client';
export default async function InventoryPage() {
  const supabase = await createClient();
  const { data: items, error: itemError } = await supabase
    .from('inventory_items')
    .select(
      `inventory_item_id, name, photo_url, subcategories(name, categories(name))`,
    );
  if (itemError) {
    console.error(itemError);
    return <div>Error loading inventory items</div>;
  }

  const { data: categories, error } = await supabase
    .from('categories')
    .select(`category_id, name, subcategories(subcategory_id, name)`)
    .order('name', { ascending: true })
    .order('name', { foreignTable: 'subcategories', ascending: true });
  if (error) {
    console.error(error);
    return <div>Error loading categories</div>;
  }

  return (
    <div>
      <div>
        {items?.map((item) => (
          <div key={item.inventory_item_id}>
            <InventoryItemCard item={item} />
          </div>
        ))}
      </div>
      <div>
        {categories?.map((cat) => (
          <div key={cat.category_id}>
            <h2>{cat.name}</h2>
            <ul>
              {cat.subcategories?.map((sub) => (
                <li key={sub.subcategory_id}>{sub.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
