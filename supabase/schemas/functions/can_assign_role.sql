create schema if not exists private;

create or replace function private.can_assign_role (new_role_id int) returns boolean language plpgsql security definer
set
  search_path = '' as $$
declare
  is_owner boolean;
  is_superadmin boolean;
  is_admin boolean;
  new_role_name text;
begin
	-- Retrieve the name of the role being assigned
  select name
  from public.roles
  where role_id = new_role_id
  into new_role_name;
  
  -- Determine if the current user has the 'owner' role
  select exists (
    select 1
    from public.user_roles ur
    join public.roles r on ur.role_id = r.role_id
    where ur.user_id = auth.uid()
    and r.name = 'owner'
  ) into is_owner;

  -- If the current user is an owner and the new role is one of the allowed roles, return true
  if is_owner and new_role_name in ('superadmin', 'admin', 'requestor') then
    return true;
  end if;

  -- Determine if the current user has the 'superadmin' role
  select exists (
    select 1
    from public.user_roles ur
    join public.roles r on ur.role_id = r.role_id
    where ur.user_id = auth.uid()
    and r.name = 'superadmin'
  ) into is_superadmin;

  -- If the current user is a superadmin and the new role is one of the allowed roles, return true
  if is_superadmin and new_role_name in ('admin', 'requestor') then
    return true;
  end if;

   -- Determine if the current user has the 'admin' role
  select exists (
    select 1
    from public.user_roles ur
    join public.roles r on ur.role_id = r.role_id
    where ur.user_id = auth.uid()
    and r.name = 'admin'
  ) into is_admin;

  -- If the current user is an admin and the new role is one of the allowed roles, return true
  if is_admin and new_role_name in ('requestor') then
    return true;
  end if;

  -- For now, if the condition above is not met, we return FALSE
  return false;
end;
$$;
