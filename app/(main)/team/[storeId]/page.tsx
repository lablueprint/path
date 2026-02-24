import { createClient } from '@/app/lib/supabase/server-client';

export default async function StoreAdminPage ( { params, }: {
    params: Promise<{ storeId: string }>
}) {
    const { storeId } = await params;

    const supabase = await createClient();
    const { data: store_data, error: store_error } = await supabase
        .from('stores')
        .select(`
            name,
            street_address
        `)
        .eq('store_id', storeId)
        .single()
    if (store_error) {
        console.log('Error fetching store information:', store_error);
        return <div>Failed to load store data.</div>;
    }

    return (
        <div>
            <h1>Store ID: {storeId}</h1>
            <p>Store Name: {store_data.name}</p>
            <p>Store Address: {store_data.street_address}</p>
        </div>
    );
}