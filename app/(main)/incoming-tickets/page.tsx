import { createClient } from "@/app/lib/supabase/server-client";
import StoresList from "@/app/components/StoresList";
type Store = {
    id: string;
    name: string;
    streetAddress: string;
}

type StoreFromDB = {
    store_id: string;
    name: string;
    street_address: string;
}

type StoreAdminRow = {
    stores: StoreFromDB | null;
}


export default async function IncomingTicketsPage() {
    const supabase = await createClient();
    // get user's claims
    const { data, error } = await supabase.auth.getClaims();
    if (error) {
        console.error("Error fetching claims data", error);
        return <div>Error loading page</div>
    }

    let stores: Store[] = [];

    const user_role = data?.claims.user_role;
    if (user_role == "superadmin" || user_role == "owner") {
        const { data, error } = await supabase.from("stores").select("*");
        if (error) {
            console.error("Error fetching stores: ", error)
        }
        else {
            stores = data.map(store => ({
                id: store.store_id,
                name: store.name,
                streetAddress: store.street_address,
            })) ?? []
        }
    }
    else {
        // get user's id
        const { data: userData, error: getUserError } = await supabase.auth.getUser();

        if (getUserError || !userData.user) {
            console.error("Error fetching user: ", getUserError);
            return <div>Error fetching user</div>
        }
        const userID = userData.user.id;

        // get all stores user is admin of
        const { data, error } = await supabase.from("store_admins").select("stores(*)").eq("user_id", userID).returns<StoreAdminRow[]>();


        if (error) {
            console.error(error);
            return <div>Error loading stores</div>
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
