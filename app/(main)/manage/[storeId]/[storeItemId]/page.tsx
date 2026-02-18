import { createClient } from '@/app/lib/supabase/server-client';

export default async function ManageStoreItempage ({ params, }: {
    params: Promise<{ storeId: string; storeItemId: string }>;
}) {
    const { storeId, storeItemId } = await params

    const supabase = await createClient();
    const { data: item_data, error: item_error} = await supabase
        .from('store_items')
        .select(`
            store_item_id,
            quantity_available,
            inventory_items(name, description, photo_url,
                subcategories(name,
                    categories(name)
                )
            )
        `)
        .eq('store_item_id', storeItemId)
        .single();
    console.log("HELLOOOOO", item_data)
    if (item_error) {
        console.error('Error fetching store item info:', item_error);
        return <div>Failed to load store item.</div>;
    }

    return (
        <div>
            <h1>Store Item Info</h1>
            <h3>Item Name: {(item_data.inventory_items as any).name}</h3>
            <h3>Item Description: {(item_data.inventory_items as any).description}</h3>
            <h3>Subcategory Name: {(item_data.inventory_items as any).subcategories.name}</h3>
            <h3>Category Name: {(item_data.inventory_items as any).subcategories.categories.name}</h3>
        </div>
    );
}