'use server';

import { createClient } from '@/app/lib/supabase/server-client';
import UsersList from './[userId]/components/UsersList';

export default async function TeamPage() {
  const supabase = await createClient();
  const { data: entry, error: err } = await supabase.from('users').select(`
    user_id,
    first_name,
    last_name,
    user_roles!fk_users (
      roles (
        name
      )
    )
  `);
  if (err) {
    console.log(err.message);
  }
  const userInfo = (entry ?? []).map((u) => ({
    user_id: u.user_id,
    first_name: u.first_name,
    last_name: u.last_name,
    user_roles: u.user_roles?.roles?.name,
  }));
  console.log(userInfo);
  return <UsersList userInfo={userInfo} />;
}
