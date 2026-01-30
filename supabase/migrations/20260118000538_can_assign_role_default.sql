set check_function_bodies = off;

CREATE OR REPLACE FUNCTION private.can_assign_role(new_role_id integer)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
  select (auth.jwt() ->> 'user_role') = 'owner' into is_owner;

  -- If the current user is an owner and the new role is one of the allowed roles, return true
  if is_owner and new_role_name in ('superadmin', 'admin', 'requestor', 'default') then
    return true;
  end if;

  -- Determine if the current user has the 'superadmin' role
  select (auth.jwt() ->> 'user_role') = 'superadmin' into is_superadmin;

  -- If the current user is a superadmin and the new role is one of the allowed roles, return true
  if is_superadmin and new_role_name in ('admin', 'requestor', 'default') then
    return true;
  end if;

   -- Determine if the current user has the 'admin' role
  select (auth.jwt() ->> 'user_role') = 'admin' into is_admin;

  -- If the current user is an admin and the new role is one of the allowed roles, return true
  if is_admin and new_role_name in ('requestor', 'default') then
    return true;
  end if;

  return false;
end;
$function$
;


