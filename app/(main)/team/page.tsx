import { createClient } from '@/app/lib/supabase/server-client';
import StoresList from '@/app/components/StoresList';
import UsersList from '@/app/(main)/team/components/UsersList';

export default async function TeamPage() {
  const supabase = await createClient();

  const { data: storesData, error: storesErr } = await supabase
    .from('stores')
    .select('store_id, name, street_address');
  if (storesErr) {
    console.error('Error fetching stores:', storesErr);
  }

  const { data: usersData, error: usersErr } = await supabase.from('users')
    .select(`
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

  const stores = storesData || [];

  const users = (usersData ?? []).map((u) => {
    const user_roles = u.user_roles as unknown as { roles: { name: string } };
    return {
      user_id: u.user_id,
      first_name: u.first_name,
      last_name: u.last_name,
      role: user_roles.roles.name,
    };
  });

  return (
    <div>
      <h1>Team</h1>
      <h2>People</h2>
      {users.length > 0 ? <UsersList users={users} /> : <p>No users found.</p>}
      <h2>Stores</h2>
      {stores.length > 0 ? (
        <StoresList stores={stores} />
      ) : (
        <p>No stores found.</p>
      )}
    </div>
  );
}
