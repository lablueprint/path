import { createClient } from '@/app/lib/supabase/server-client';
import ItemCard from '@/app/(main)/components/ItemCard';
import ItemSearch from '@/app/(main)/components/ItemSearch';
import Link from 'next/link';
import styles from './page.module.css';
import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';

type SearchParams = {
  query?: string;
  category?: string;
  subcategory?: string;
};

export default async function ManageStorePage({
  params,
  searchParams,
}: {
  params: Promise<{ storeId: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { storeId } = await params;
  const { query, category, subcategory } = await searchParams;

  const supabase = await createClient();

  const { data: categories } = await supabase
    .from('categories')
    .select('category_id, name')
    .order('name');

  const { data: subcategories } = await supabase
    .from('subcategories')
    .select('subcategory_id, name, category_id')
    .order('name');

  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('*')
    .eq('store_id', storeId)
    .single();


  if (storeError || !store) {
    console.error('Error fetching store:', storeError);
    return <div>Failed to load store.</div>;
  }

  let filteredItems = supabase
    .from('store_items')
    .select(
      `
        store_item_id,
        inventory_items!inner(
          name,
          photo_url,
          subcategories!inner(
            name,
            categories!inner(
              name
            )
          )
        )
      `,
    )
    .eq('store_id', storeId);

  if (query) {
    filteredItems = filteredItems.ilike('inventory_items.name', `%${query}%`);
  }

  if (category) {
    filteredItems = filteredItems.eq(
      'inventory_items.subcategories.category_id',
      category,
    );
  }

  if (subcategory) {
    filteredItems = filteredItems.eq(
      'inventory_items.subcategory_id',
      subcategory,
    );
  }

  const { data: itemsData, error: itemsError } =
    await filteredItems.overrideTypes<
      {
        store_item_id: string;
        inventory_items: {
          name: string;
          photo_url: string | null;
          subcategories: {
            name: string;
            categories: {
              name: string;
            };
          };
        };
      }[],
      { merge: false }
    >();

  if (itemsError) {
    console.error('Error fetching store items:', itemsError);
    return <div>Failed to load store items.</div>;
  }

  // Sort itemsData in JavaScript
  const sortedItemsData = itemsData?.sort((a, b) => {
    const nameA = a.inventory_items.name.toLowerCase() || '';
    const nameB = b.inventory_items.name.toLowerCase() || '';
    return nameA.localeCompare(nameB);
  });

  const items = sortedItemsData?.map((item) => ({
    id: item.store_item_id,
    item: item.inventory_items.name,
    subcategory: item.inventory_items.subcategories.name,
    category: item.inventory_items.subcategories.categories.name,
    photoUrl: item.inventory_items.photo_url,
  }));

  return (
    <div>
      <Breadcrumbs
        labelMap={{
          manage: 'Manage Inventory',
          [storeId]: store.name,
        }}
      />
      <div className={styles.pageHeader}>
        <h1>
          <span className={styles.managingFrom}>Managing </span>
          {store.name}
          {' '}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={styles.pinIcon}
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </h1>
        <Link href={`/manage/${storeId}/add`} className={styles.addLink}>
          + Add store items / gift-in-kind form
        </Link>
      </div>

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

      <h2>Items</h2>
      {items && items.length > 0 ? (
        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 g-3">
          {items.map((item) => (
            <div key={item.id} className="col">
              <ItemCard
                id={item.id}
                item={item.item}
                photoUrl={item.photoUrl}
                subcategory={item.subcategory}
                category={item.category}
              />
            </div>
          ))}
        </div>
      ) : (
        <p>No items found.</p>
      )}
    </div>
  );
}
