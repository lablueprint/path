import { createClient } from '@/app/lib/supabase/server-client';

export default async function ManageStorePage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;

  // fetching data for store associated with storeId
  const supabase = await createClient();
  const { data: store, error: id_error } = await supabase
    .from('stores')
    .select('*')
    .eq('store_id', storeId)
    .single();
  if (id_error) {
    console.error('Error fetching store:', id_error);
    return <div>Failed to load store data.</div>;
  }

  const { data: items, error: items_error } = await supabase
    .from('store_items')
    .select(
      `
            store_item_id,
            inventory_item_id,
            item_name:inventory_item_id(name),
            item_photo_url:inventory_item_id(photo_url),
            subcategory_id:inventory_items(subcategory_id),
            subcategory_name:inventory_items(subcategories(name)),
            category_name:inventory_items(subcategories(categories(name)))
        `,
    )
    .eq('store_id', storeId);
  console.log('Hello', items);
  if (items_error) {
    console.error('Error fetching store items:', items_error);
    return <div>Failed to load store items.</div>;
  }

  return (
    <div>
      <h1>Store Info</h1>
      <h3>Store ID: {storeId}</h3>
      <h3>Store Name: {store.name}</h3>
      <h3>Store Address: {store.street_address}</h3>
    </div>
  );

  // // const { data: store_item_data, error: store_item_err } = await supabase
  // //     .from('store_items')
  // //     .select(`
  // //         inventory_item_id,
  // //         item_name:inventory_item_id(name),
  // //         item_photo_url:inventory_item_id(photo_url),
  // //         item_subcat_name:inventory_item_id(subcategory_id(name)),
  // //         item_cat_name:inventory_item_id(subcategory_id(category_id(name))),
  // //     `)
  // //     .eq('store_id', storeId);
  // const { data: store_item_data, error: store_item_err } = await supabase
  //     .from('store_items')
  //     .select(`
  //         inventory_item_id,
  //         inventory_items(name)
  //     `)
  //     .eq('store_id', storeId);
  // console.log("hello")
  // console.log(store_item_data)
  // // only noted in console, rest of the page continues
  // if (store_item_err) {
  //     console.log('Error fetching store items:', store_item_err);
  // }

  // return (
  //     <div>
  //         <h1>Store Info</h1>
  //         <h3>Name: {store_data.name}</h3>
  //         <h3>Address: {store_data.street_address}</h3>
  //         <h3>Item:</h3>
  //         {store_item_data?.length ? (
  //             <ul>
  //                 {store_item_data.map((item) => (
  //                     <li>{item.inventory_item_id}: {(item.inventory_items as any)?.name}</li>
  //                 ))}
  //             </ul>
  //         ) : (<p>No items found for this store.</p>)}
  //     </div>
  // );
}
