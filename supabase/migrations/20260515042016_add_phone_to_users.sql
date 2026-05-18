alter table "public"."users" add column "phone" text;

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

CREATE OR REPLACE FUNCTION private.can_manage_store(store_to_manage_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  -- Declare variables
  is_owner boolean;
  is_superadmin boolean;

begin
  -- Determine if current user is 'superadmin' or 'owner', return true
  select (auth.jwt() ->> 'user_role') = 'owner' into is_owner;
  select (auth.jwt() ->> 'user_role') = 'superadmin' into is_superadmin;

  if is_owner or is_superadmin then
    return true;
  end if;
    
  -- If current user is a store admin, return true
  if exists (
    select 1
    from public.store_admins
    where store_to_manage_id = store_id and auth.uid() = user_id
  ) then 
    return true;
  end if;
  return false;

end;
$function$
;

CREATE OR REPLACE FUNCTION private.handle_new_store_admin()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  current_role_name text;
begin
  select r.name into current_role_name
  from public.user_roles ur
  join public.roles r on ur.role_id = r.role_id
  where ur.user_id = new.user_id;

  if current_role_name in ('default', 'requestor') then
    update public.user_roles
    set role_id = 3
    where user_id = new.user_id;
  end if;
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION private.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin

  insert into public.users (user_id, first_name, last_name, email, phone)
  values (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.email,
    new.raw_user_meta_data ->> 'phone'
  );

  insert into public.user_roles(user_id, role_id)
  values (
    new.id,
    case
      when right(new.email, 9) = 'epath.org' then 2
      else 1
    end
  );

  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION private.handle_user_email_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
begin
  update public.users
  set email = new.email
  where user_id = new.id;
	return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION private.handle_user_role_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  updated_role_name text;
begin
  select r.name into updated_role_name
  from public.roles r
  where r.role_id = new.role_id;

  if updated_role_name in ('default', 'requestor') then
    delete from public.store_admins
    where user_id = new.user_id;
  end if;
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.can_manage_store(store_to_manage_id uuid)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
  select private.can_manage_store(store_to_manage_id);
$function$
;

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
 SET search_path TO 'public'
AS $function$
  declare
    claims jsonb;
    user_role text;
  begin
    select r.name into user_role
    from public.user_roles ur
    join public.roles r on ur.role_id = r.role_id
    where ur.user_id = (event ->> 'user_id')::uuid
    limit 1;

    claims := event -> 'claims';

    if user_role is not null then
      -- Set the claim
      claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
    else
      claims := jsonb_set(claims, '{user_role}', 'null'::jsonb);
    end if;

    -- Update the claims object in the original event
    event := jsonb_set(event, '{claims}', claims);

    -- Return the modified or original event
    return event;
  end;
$function$
;


