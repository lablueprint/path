-- Role for RLS: read from public.user_roles (source of truth) instead of relying on JWT
-- custom claims, which can be missing or stale for some Supabase clients / server actions.
create or replace function private.get_auth_user_role_name () returns text language sql stable security definer
set
  search_path = public as $$
  select
    r.name
  from
    public.user_roles ur
    join public.roles r on r.role_id = ur.role_id
  where
    ur.user_id = auth.uid ();
$$;

revoke all on function private.get_auth_user_role_name () from public;

grant execute on function private.get_auth_user_role_name () to authenticated;

-- anon: harmless (auth.uid() is null); storage / edge cases that run as anon may call helpers
grant execute on function private.get_auth_user_role_name () to anon;
