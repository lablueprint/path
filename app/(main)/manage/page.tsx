
// Get the user’s claims with `supabase.auth.getClaims` 
// (for an example, check out the auth test component). 
// Extract the user’s role from the claim called `user_role`.
// If the user’s role is “superadmin” or “owner”, get all stores from the `stores` table. 
// Otherwise, get the user’s ID with `supabase.auth.getUser` and get all stores from `stores` that the user is an admin of.
// Pass the data to `StoresList` and display the component.

import { createClient } from '@/app/lib/supabase/server-client';
import StoresList from '@/app/components/StoresList';

type Store = {
    id: string;
    name: string;
    streetAddress: string;
};

type StoreFromDB = {
    store_id: string;
    name: string;
    street_address: string;
};

type StoreAdminRow = {
    stores: StoreFromDB | null;
};

export default async function ManagePage() {
    const supabase = await createClient();

    // get user's claims
    const { data: claimsData, error: claimsError } =
        await supabase.auth.getClaims();

    if (claimsError) {
        console.error("Error fetching claims data", claimsError);
        return <div>Error loading page</div>
    }

    const userRole = claimsData?.claims?.user_role;

    let stores: Store[] = [];

    // if user's role is "superadmin" or "owner" get all stores from stores table
    if (userRole === "superadmin" || userRole === "owner") {
        const { data, error } = await supabase
            .from("stores")
            .select("*");

        if (error) {
            console.error("Error fetching stores: ", error);
        }
        else {
            // stores = data ?? [];
            stores = data?.map(store => ({
                id: store.store_id,
                name: store.name,
                streetAddress: store.street_address,
            })) ?? [];
        }
    }
    else { // get user's ID and get all stores that user is admin of
        const { data: userData, error: getUserError } =
            await supabase.auth.getUser();

        if (getUserError || !userData?.user) {
            console.error("Error fetching user: ", getUserError);
            return <div>Error fetching user</div>
        }

        const userId = userData.user.id;

        const { data, error } = await supabase
            .from("store_admins")
            .select("stores(*)")
            .eq("user_id", userId)
            .returns<StoreAdminRow[]>();

        if (error) {
            console.error(error);
            return <div>Error loading stores</div>;
        }

        stores =
            data
                ?.map(row => row.stores as StoreFromDB)
                .filter(store => store !== null && store !== undefined)
                .map(store => ({
                    id: store.store_id,
                    name: store.name,
                    streetAddress: store.street_address,
                })) ?? [];
    }

    return <StoresList stores={stores} />
}
