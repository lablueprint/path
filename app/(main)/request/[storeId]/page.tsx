import { createClient } from '@/app/lib/supabase/server-client';
import ItemCard from '@/app/(main)/components/ItemCard';
import ItemSearch from '@/app/(main)/components/ItemSearch';
import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';
import Link from 'next/link';
import AddOutOfStockToCartForm from '@/app/(main)/request/components/AddOutOfStockToCartForm';

type SearchParams = {
  query?: string;
  category?: string;
  subcategory?: string;
};

export default async function RequestStorePage({
  params,
  searchParams,
}: {
  params: Promise<{ storeId: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { storeId } = await params;

  const supabase = await createClient();

  // Fetch store
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('*')
    .eq('store_id', storeId)
    .single();

  if (storeError || !store) {
    console.error('Error fetching store:', storeError);
    return <div>Failed to load store.</div>;
  }

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('category_id, name')
    .order('name');

  // Fetch subcategories
  const { data: subcategories } = await supabase
    .from('subcategories')
    .select('subcategory_id, name, category_id')
    .order('name');

  // Fetch non-hidden store items
  const { query, category, subcategory } = await searchParams;

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
    .eq('store_id', storeId)
    .eq('is_hidden', false);

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
      <Breadcrumbs labelMap={{ [`/request/${storeId}`]: store.name }} />{' '}
      <div>
        <h1>{store.name}</h1>
        <p>{store.street_address}</p>
      </div>
      <Link href={`/request/${storeId}/cart`}>Cart</Link>
      <ItemSearch
        categories={
          categories?.map((cat) => ({ id: cat.category_id, name: cat.name })) ||
          []
        }
        subcategories={
          subcategories?.map((sub) => ({
            id: sub.subcategory_id,
            name: sub.name,
            category_id: sub.category_id,
          })) || []
        }
      />
      <h2>Out-of-Stock Request</h2>
      <AddOutOfStockToCartForm storeId={storeId} />
      <h2>In-Stock Items</h2>
      {items && items.length > 0 ? (
        <div>
          {items.map((item) => (
            <ItemCard
              key={item.id}
              id={item.id}
              item={item.item}
              subcategory={item.subcategory}
              category={item.category}
              photoUrl={item.photoUrl}
            />
          ))}
        </div>
      ) : (
        <p>No available items found.</p>
      )}
    </div>
  );
}
