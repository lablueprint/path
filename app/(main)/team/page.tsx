import { createClient } from '@/app/lib/supabase/server-client';
import StoresList from '@/app/components/StoresList';
import UsersList from '@/app/(main)/team/[userId]/components/UsersList';

export default async function TeamPage() {
  const supabase = await createClient();

  // get all stores from the stores table
  const { data: stores, error: storesErr } = await supabase
    .from('stores')
    .select('store_id, name, street_address');

  if (storesErr) {
    console.error('Error fetching stores:', storesErr);
  }

  const { data: users, error: usersErr } = await supabase.from('users').select(`
    user_id,
    first_name,
    last_name,
    user_roles!fk_users (
      roles (
        name
      )
    )
  `);
  if (usersErr) {
    console.error('Error fetching users:', usersErr);
  }
  const userInfo = (users ?? []).map((u) => ({
    user_id: u.user_id,
    first_name: u.first_name,
    last_name: u.last_name,
    user_roles: u.user_roles?.roles?.name,
  }));

  return (
    <div>
      <h1>Team</h1>
      <UsersList userInfo={userInfo} />
      <StoresList stores={stores || []} />
    </div>
  );
}