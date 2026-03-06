import { createClient } from '@/app/lib/supabase/server-client';
import ItemCard from '@/app/(main)/components/ItemCard';
import ItemSearch from '../../components/ItemSearch';

type SearchParams = {
  query?: string;
  category?: string;
  subcategory?: string;
}

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

  let ticketsFiltered = supabase
    .from('store_items')
    .select(
      `
      store_item_id,
      inventory_item_id!inner(
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

  if (query) { ticketsFiltered = ticketsFiltered.ilike('inventory_item_id.name', `%${query}%`); }
  if (category) { ticketsFiltered = ticketsFiltered.eq('inventory_item_id.subcategories.category_id', category); }
  if (subcategory) { ticketsFiltered = ticketsFiltered.eq('inventory_item_id.subcategory_id', subcategory); }

  const { data: itemsData, error: itemsError } = await ticketsFiltered;

  if (itemsError) {
    console.error('Error fetching store items:', itemsError);
    return <div>Failed to load store items.</div>;
  }

  // Sort itemsData in JavaScript
  const sortedItemsData = itemsData?.sort((a, b) => {
    const nameA = (a.inventory_item_id as any)?.name?.toLowerCase() || '';
    const nameB = (b.inventory_item_id as any)?.name?.toLowerCase() || '';
    return nameA.localeCompare(nameB);
  });

  const items = sortedItemsData?.map((item) => ({
    id: item.store_item_id as string,
    item: (item.inventory_item_id as any)?.name as string,
    subcategory: (item.inventory_item_id as any)?.subcategories?.name as string,
    category: (item.inventory_item_id as any)?.subcategories?.categories
      ?.name as string,
    photoUrl: (item.inventory_item_id as any)?.photo_url as string,
  }));

  return (
    <div>
      <div>
        <h1>{store.name}</h1>
        <p>{store.street_address}</p>
      </div>

      <ItemSearch
        categories={categories?.map(cat => ({ id: cat.category_id, name: cat.name })) || []}
        subcategories={subcategories?.map(sub => ({ id: sub.subcategory_id, name: sub.name, category_id: sub.category_id })) || []}
      />

      <h2>Available Items</h2>

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
        <h3>No available items found.</h3>
      )}
    </div>
  );
}