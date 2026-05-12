import { createClient } from '@/app/lib/supabase/server-client';
import ItemSearch from '@/app/(main)/components/ItemSearch';
import ItemCard from '@/app/(main)/components/ItemCard';
import Link from 'next/link';
import AddOutOfStockToCartForm from '@/app/(main)/request/components/AddOutOfStockToCartForm';
import Accordion from 'react-bootstrap/Accordion';
import AccordionBody from 'react-bootstrap/AccordionBody';
import AccordionHeader from 'react-bootstrap/AccordionHeader';
import AccordionItem from 'react-bootstrap/AccordionItem';
import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';
import styles from '@/app/(main)/request/Cart.module.css';
import Image from 'next/image';
import cartIcon from '@/public/cart-icon.svg';

type SearchParams = {
  query?: string;
  category?: string;
  subcategory?: string;
};

export default async function RequestAllStoresPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const supabase = await createClient();

  // Fetch stores
  const { data: stores, error: storesError } = await supabase
    .from('stores')
    .select('store_id, name')
    .order('name');

  if (storesError || !stores) {
    console.error('Error fetching stores:', storesError);
    return <div>Failed to load stores.</div>;
  }

  //Fetch categories
  const { data: categories, error: categoryError } = await supabase
    .from('categories')
    .select('category_id, name')
    .order('name');
  if (categoryError || !categories) {
    console.error('Error fetching categories:', categoryError);
    return <div>Failed to load categories.</div>;
  }
  //Fetch subcategories
  const { data: subcategories, error: subcategoryError } = await supabase
    .from('subcategories')
    .select('subcategory_id, name, category_id')
    .order('name');
  if (subcategoryError || !subcategories) {
    console.error('Error fetching subcategories:', subcategoryError);
    return <div>Failed to load subcategories.</div>;
  }

  // Fetch non-hidden store items
  const { query, category, subcategory } = await searchParams;

  let filteredItems = supabase
    .from('store_items')
    .select(
      `
        store_item_id,
        store_id,
        inventory_items!inner(
          name,
          photo_url,
          subcategories!inner(
            name,
            category_id,
            categories!inner(
              name
            )
          )
        )
      `,
    )
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
        store_id: string;
        inventory_items: {
          name: string;
          photo_url: string | null;
          subcategories: {
            name: string;
            category_id: string;
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

  const sortedItemsData = itemsData?.sort((a, b) => {
    const nameA = a.inventory_items.name.toLowerCase();
    const nameB = b.inventory_items.name.toLowerCase();
    return nameA.localeCompare(nameB) || a.store_id.localeCompare(b.store_id);
  });

  // Group items by store_id
  const itemsByStore = new Map<string, (typeof sortedItemsData)[number][]>();
  sortedItemsData?.forEach((item) => {
    if (!itemsByStore.has(item.store_id)) {
      itemsByStore.set(item.store_id, []);
    }
    itemsByStore.get(item.store_id)!.push(item);
  });

  // Sort stores alphabetically by store name
  const sortedStores = stores.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <Breadcrumbs
        labelMap={{
          request: 'Request Inventory',
          all: 'All Stores',
        }}
      />
      <div>
        <h1>Requesting from All Stores</h1>
      </div>
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

      {sortedStores.map((store) => {
        const storeItems = itemsByStore.get(store.store_id) || [];
        return (
          <Accordion key={store.store_id}>
            <AccordionItem eventKey={store.store_id}>
              <AccordionHeader>{store.name}</AccordionHeader>
              <AccordionBody>
                <h3>Out-of-Stock Request</h3>
                <AddOutOfStockToCartForm storeId={store.store_id} />
                {storeItems.length > 0 ? (
                  <div>
                    <h3>In-Stock Items</h3>
                    {storeItems.map((item) => (
                      <ItemCard
                        key={item.store_item_id}
                        id={item.store_item_id}
                        item={item.inventory_items.name}
                        subcategory={item.inventory_items.subcategories.name}
                        category={
                          item.inventory_items.subcategories.categories.name
                        }
                        photoUrl={item.inventory_items.photo_url}
                      />
                    ))}
                  </div>
                ) : (
                  <p>No available items in this store.</p>
                )}
              </AccordionBody>
            </AccordionItem>
          </Accordion>
        );
      })}
      <Link href={`/request/all/cart`} className={styles.cartButton}>
        <Image src={cartIcon} height={32} alt="Cart icon" />
      </Link>
    </div>
  );
}
