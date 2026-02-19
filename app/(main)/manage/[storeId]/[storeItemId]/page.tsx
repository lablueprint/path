import { createClient } from '@/app/lib/supabase/server-client';
import StoreItemForm from './StoreItemForm';

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
            is_hidden,
            inventory_items(name, description, photo_url,
                subcategories(name,
                    categories(name)
                )
            )
        `)
        .eq('store_item_id', storeItemId)
        .single();
    if (item_error) {
        console.error('Error fetching store item info:', item_error);
        return <div>Failed to load store item.</div>;
    }

    return (
        <div>
            <h1>Store Item Info</h1>
            <p>Item Name: {(item_data.inventory_items as any).name}</p>
            <p>Item Description: {(item_data.inventory_items as any).description}</p>
            <p>Subcategory Name: {(item_data.inventory_items as any).subcategories.name}</p>
            <p>Category Name: {(item_data.inventory_items as any).subcategories.categories.name}</p>

            <StoreItemForm
                store_id={storeId}
                store_item_id={storeItemId}
                quantity={item_data.quantity_available ?? 0}
                visibility={item_data.is_hidden ?? false}
            />
        </div>
    );
}