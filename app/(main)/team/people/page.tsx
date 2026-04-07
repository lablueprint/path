import { createClient } from '@/app/lib/supabase/server-client';
import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';
import UsersList from '@/app/(main)/team/people/components/UsersList';

export default async function UsersPage() {
  const supabase = await createClient();

  const { data: usersData, error: usersErr } = await supabase
    .from('users')
    .select(
      `
        user_id,
        first_name,
        last_name,
        user_roles!fk_users (
          roles (
            name
          )
        )
      `,
    );

  if (usersErr) {
    console.error('Error fetching users:', usersErr);
  }

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
      <Breadcrumbs
        labelMap={{
          team: 'Team',
          people: 'People',
        }}
      />

      <h1>People</h1>
      {users.length > 0 ? <UsersList users={users} /> : <p>No users found.</p>}
    </div>
  );
}
