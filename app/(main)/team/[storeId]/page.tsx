import { createClient } from '@/app/lib/supabase/server-client';
import DeleteStoreAdminButton from './components/DeleteStoreAdminButton';

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

    // get user's claims
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
    if (claimsError) {
        console.error('Error fetching claims data:', claimsError);
    }

    const userRole = claimsData?.claims?.user_role;
    const userId = claimsData?.claims?.sub;

    // check if the user is the store's admin, superadmin, or owner
    const { data: admin } = await supabase
        .from('store_admins')
        .select('')
        .eq('store_id', storeId)
        .eq('user_id', userId)
    const canChangeAdmins = !!admin || userRole === 'superadmin' || userRole === 'owner';

    const { data: admins, error: adminsError } = await supabase
        .from('store_admins')
        .select(`
            store_admin_id,
            user_id,
            users(user_id, first_name, last_name, email)
        `)
        .eq('store_id', storeId)
    if (adminsError) {
        console.error('Error fetching store admins:', adminsError);
        return <div>Failed to load store admins.</div>;
    }
    console.log('YOOOOOO', admins[0])

    return (
        <div>
            <div>
                <h1>Store ID: {storeId}</h1>
                <p>Store Name: {store_data.name}</p>
                <p>Store Address: {store_data.street_address}</p>
            </div>
            {/* viewing store admins */}
            <div>
                {admins?.length ? (
                    admins.map((admin) => {
                        const user = Array.isArray(admin.users) ? admin.users[0] : admin.users;

                        return (
                        <div key={admin.store_admin_id} style={{border: '2px solid black', borderRadius: '10px', padding: '10px', marginBottom: '10px'}}>
                            <p>Admin: {user?.first_name} {user?.last_name}</p>
                            <p>Contact: {user?.email}</p>

                            {canChangeAdmins && (
                                <DeleteStoreAdminButton storeAdminId={admin.store_admin_id} />
                            )}
                        </div>
                        );
                    })
                ) : (
                    <div>No admins found.</div>
                )}
            </div>
        </div>
    );
}