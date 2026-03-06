import { createClient } from "../../../lib/supabase/server-client";
import type { Store } from "../../../types/store";
import { EditStoreForm } from '../components/EditStoreForm';
import { RemoveStoreButton } from './components/RemoveStoreButton';


type StoreDetailsPageProps = {
    params: { storeId: string };
};


export default async function StoreDetailsPage({ params }: StoreDetailsPageProps) {
    const { storeId } = params;
    const supabase = await createClient();


    const { data: storeData, error: err } = await supabase
        .from('stores')
        .select('store_id, name, street_address')
        .eq('store_id', storeId)
        .single();


    if (err) {
        console.error('Error fetching store:', err);
    }


    const store = storeData as Store;


    return (
        <div>
            {store ? (
                <>
                    <EditStoreForm store={store} />
                    <RemoveStoreButton storeId={store.store_id} />
                </>
            ) : (
                <p>Store not found.</p>
            )}
        </div>
    );
}


