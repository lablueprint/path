import { createClient } from '@/app/lib/supabase/server-client';
import StoresList from '@/app/components/StoresList';

const supabase = await createClient();

type Store = {
    id: string
    name: string
    streetAddress: string
}

export default async function TeamPage() {
    // get all stores from the stores table
    const { data: stores, error: err } = await supabase
        .from('stores')
        .select('store_id, name, street_address');

    if (err) {
        console.error('Error fetching stores:', err);
        return <p>Failed to load stores</p>;
    }

    // map database fields to component props
    const mappedStores: Store[] = stores.map((s) => ({
        id: s.store_id,
        name: s.name,
        streetAddress: s.street_address,
    }))

    return (
        <div>
            <h1>Team Page</h1>
            <StoresList stores={mappedStores} />
        </div>
    )
}
