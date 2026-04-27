import ItemCard from '@/app/(main)/components/ItemCard';
import { createClient } from '@/app/lib/supabase/server-client';
import Link from 'next/link';
<<<<<<< HEAD
import EditCategories from './add/components/EditCategories';
=======
import ItemSearch from '@/app/(main)/components/ItemSearch';
>>>>>>> origin/main

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

<<<<<<< HEAD
  const { data: claimsData } = await supabase.auth.getClaims();
  const role = claimsData?.claims?.user_role;
  const userId = claimsData?.claims?.sub;

  const { data: itemsData, error: itemError } = await supabase
=======
  // Don't need to fetch categories as it is done later
  // Fetch subcategories
  const { data: subcategories } = await supabase
    .from('subcategories')
    .select('subcategory_id, name, category_id')
    .order('name');

  const { query, category, subcategory } = await searchParams;
  let filteredItems = supabase
>>>>>>> origin/main
    .from('inventory_items')
    .select(
      `inventory_item_id, name, photo_url, subcategories!inner(name, categories!inner(name))`,
    );

<<<<<<< HEAD
=======
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
>>>>>>> origin/main
  if (itemError) {
    console.error(itemError);
    return <div>Failed to load inventory items.</div>;
  }

  const { data: categories, error } = await supabase
    .from('categories')
    .select(`category_id, name, subcategories(subcategory_id, name)`)
    .order('name', { ascending: true })
<<<<<<< HEAD
    .order('name', { referencedTable: 'subcategories', ascending: true });

=======
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
>>>>>>> origin/main
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
<<<<<<< HEAD
      <h1>Library</h1>
      <Link href="/manage/inventory/add">Add inventory item</Link>

      <h2>Items</h2>
=======
      <h1>Inventory Library</h1>
      <Link href="/manage/inventory/add">
        <p>Add inventory item</p>
      </Link>
>>>>>>> origin/main
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
<<<<<<< HEAD
        ))}
      </div>

      <h2>Categories</h2>

      {role === 'admin' && (
        <ul>
          {categories?.map((cat) => (
=======
        ))
      ) : (
        <p>No items found.</p>
      )}
      <h2>Categories</h2>
      <ul>
        {categories && categories.length > 0 ? (
          categories.map((cat) => (
>>>>>>> origin/main
            <li key={cat.category_id}>
              {cat.name}
              <ul>
                {cat.subcategories?.map((sub) => (
                  <li key={sub.subcategory_id}>{sub.name}</li>
                ))}
              </ul>
            </li>
<<<<<<< HEAD
          ))}
        </ul>
      )}

      {(role === 'superadmin' || role === 'owner') && (
        <EditCategories categories={categories} />
      )}
=======
          ))
        ) : (
          <p>No categories found.</p>
        )}
      </ul>
>>>>>>> origin/main
    </div>
  );
}