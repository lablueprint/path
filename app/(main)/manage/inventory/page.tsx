import ItemCard from '@/app/(main)/components/ItemCard';
import { createClient } from '@/app/lib/supabase/server-client';
import Link from 'next/link';
import ItemSearch from '@/app/(main)/components/ItemSearch';

type SearchParams = {
  query?: string;
  category?: string;
  subcategory?: string;
};

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const supabase = await createClient();

  // Don't need to fetch categories as it is done later
  // Fetch subcategories
  const { data: subcategories } = await supabase
    .from('subcategories')
    .select('subcategory_id, name, category_id')
    .order('name');

  const { query, category, subcategory } = await searchParams;
  let filteredItems = supabase
    .from('inventory_items')
    .select(
      `inventory_item_id, name, photo_url, subcategories!inner(name, categories!inner(name))`,
    );

  if (query) {
    filteredItems = filteredItems.ilike('name', `%${query}%`);
  }
  if (category) {
    filteredItems = filteredItems.eq('subcategories.category_id', category);
  }
  if (subcategory) {
    filteredItems = filteredItems.eq('subcategory_id', subcategory);
  }

  const { data: itemsData, error: itemError } =
    await filteredItems.overrideTypes<
      {
        inventory_item_id: string;
        name: string;
        photo_url: string | null;
        subcategories: {
          name: string;
          categories: {
            name: string;
          };
        };
      }[],
      { merge: false }
    >();
  if (itemError) {
    console.error(itemError);
    return <div>Failed to load inventory items.</div>;
  }

  const { data: categories, error } = await supabase
    .from('categories')
    .select(`category_id, name, subcategories(subcategory_id, name)`)
    .order('name', { ascending: true })
    .order('name', { referencedTable: 'subcategories', ascending: true })
    .overrideTypes<
      {
        category_id: string;
        name: string;
        subcategories: {
          name: string;
          subcategory_id: string;
        }[];
      }[],
      { merge: false }
    >();
  if (error) {
    console.error(error);
    return <div>Failed to load categories.</div>;
  }

  const items = itemsData?.map((item) => ({
    id: item.inventory_item_id,
    item: item.name,
    photoUrl: item.photo_url,
    subcategory: item.subcategories.name,
    category: item.subcategories.categories.name,
  }));

  return (
    <div>
      <h1>Inventory Library</h1>
      <Link href="/manage/inventory/add">
        <p>Add inventory item</p>
      </Link>
      <div>
        <ItemSearch
          categories={
            categories?.map((cat) => ({
              id: cat.category_id,
              name: cat.name,
            })) || []
          }
          subcategories={
            subcategories?.map((sub) => ({
              id: sub.subcategory_id,
              name: sub.name,
              category_id: sub.category_id,
            })) || []
          }
        />
      </div>
      <h2>Items</h2>
      {items && items.length > 0 ? (
        items.map((item) => (
          <div key={item.id}>
            <ItemCard
              id={item.id}
              item={item.item}
              photoUrl={item.photoUrl}
              subcategory={item.subcategory}
              category={item.category}
            />
          </div>
        ))
      ) : (
        <p>No items found.</p>
      )}
      <h2>Categories</h2>
      <ul>
        {categories && categories.length > 0 ? (
          categories.map((cat) => (
            <li key={cat.category_id}>
              {cat.name}
              <ul>
                {cat.subcategories?.map((sub) => (
                  <li key={sub.subcategory_id}>{sub.name}</li>
                ))}
              </ul>
            </li>
          ))
        ) : (
          <p>No categories found.</p>
        )}
      </ul>
    </div>
  );
}
