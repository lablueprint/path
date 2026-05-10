import { createClient } from '@/app/lib/supabase/server-client';
import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';
import UsersList from '@/app/(main)/team/people/components/UsersList';
import UserSearch from '@/app/(main)/team/people/components/UserSearch';
import ViewToggle, { ViewMode } from '../../components/ViewToggle';
import TeamUserCard from '../../components/TeamUserCard';

type searchParams = {
  query?: string;
  role?: string;
  view?: string;
};

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<searchParams>;
}) {
  const supabase = await createClient();

  const { query, role, view = 'grid' } = await searchParams;

  const { data: rolesData } = await supabase
    .from('roles')
    .select('role_id, name')
    .order('name', { ascending: true });

  let filteredUsersData = supabase.from('users').select(
    `
        user_id,
        first_name,
        last_name,
        full_name,
        email,
        profile_photo_url,
        user_roles!inner(
          roles!inner (
            name,
            role_id
          )
        )
      `,
  );

  if (query) {
    filteredUsersData = filteredUsersData.ilike('full_name', `%${query}%`);
  }
  if (role) {
    const roleId = Number(role);
    if (!Number.isNaN(roleId)) {
      filteredUsersData = filteredUsersData.eq(
        'user_roles.roles.role_id',
        roleId,
      );
    }
  }

  filteredUsersData = filteredUsersData.order('first_name', {
    ascending: true,
  });

  const { data: usersData, error: usersErr } = await filteredUsersData;
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
      email: u.email,
      profile_photo_url: u.profile_photo_url,
    };
  });

  return (
    <div>
      <Breadcrumbs
        labelMap={{
          '/team': 'Team',
          '/team/people': 'People',
        }}
      />

      <h1>People</h1>
      <ViewToggle useUrl />
      <UserSearch roles={rolesData ?? []} />

      {users.length > 0 ? (
        view == 'grid' ? (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-5">
            {users.map((u) => (
              <div key={u.user_id} className="col">
                <TeamUserCard user={u} />
              </div>
            ))}
          </div>
        ) : (
          <UsersList users={users} />
        )
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
}
