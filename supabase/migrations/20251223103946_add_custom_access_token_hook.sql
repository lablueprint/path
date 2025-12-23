create sequence "public"."roles_role_id_seq";

drop policy "authenticated can read roles" on "public"."roles";

drop policy "authenticated can delete user_roles if can_assign_role" on "public"."user_roles";

drop policy "authenticated can insert user_roles if can_assign_role" on "public"."user_roles";

drop policy "authenticated can read user_roles" on "public"."user_roles";

alter table "public"."roles" alter column "role_id" set default nextval('public.roles_role_id_seq'::regclass);

alter sequence "public"."roles_role_id_seq" owned by "public"."roles"."role_id";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
 SET search_path TO 'public'
AS $function$
  declare
    claims jsonb;
    user_roles_array jsonb;
  begin
    -- Aggregate all roles into an array
    select jsonb_agg(r.name) into user_roles_array
    from public.user_roles ur
    join public.roles r on ur.role_id = r.role_id
    where ur.user_id = (event->>'user_id')::uuid;

    claims := event->'claims';

    if user_roles_array is not null then
      -- Set the claim as an array
      claims := jsonb_set(claims, '{user_roles}', user_roles_array);
    else
      claims := jsonb_set(claims, '{user_roles}', '[]'::jsonb);
    end if;

    -- Update the 'claims' object in the original event
    event := jsonb_set(event, '{claims}', claims);

    -- Return the modified or original event
    return event;
  end;
$function$
;

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
  select (auth.jwt() -> 'user_roles') ? 'owner' into is_owner;

  -- If the current user is an owner and the new role is one of the allowed roles, return true
  if is_owner and new_role_name in ('superadmin', 'admin', 'requestor') then
    return true;
  end if;

  -- Determine if the current user has the 'superadmin' role
  select (auth.jwt() -> 'user_roles') ? 'superadmin' into is_superadmin;

  -- If the current user is a superadmin and the new role is one of the allowed roles, return true
  if is_superadmin and new_role_name in ('admin', 'requestor') then
    return true;
  end if;

   -- Determine if the current user has the 'admin' role
  select (auth.jwt() -> 'user_roles') ? 'admin' into is_admin;

  -- If the current user is an admin and the new role is one of the allowed roles, return true
  if is_admin and new_role_name in ('requestor') then
    return true;
  end if;

  return false;
end;
$function$
;

grant delete on table "public"."roles" to "supabase_auth_admin";

grant insert on table "public"."roles" to "supabase_auth_admin";

grant references on table "public"."roles" to "supabase_auth_admin";

grant select on table "public"."roles" to "supabase_auth_admin";

grant trigger on table "public"."roles" to "supabase_auth_admin";

grant truncate on table "public"."roles" to "supabase_auth_admin";

grant update on table "public"."roles" to "supabase_auth_admin";

grant delete on table "public"."user_roles" to "supabase_auth_admin";

grant insert on table "public"."user_roles" to "supabase_auth_admin";

grant references on table "public"."user_roles" to "supabase_auth_admin";

grant select on table "public"."user_roles" to "supabase_auth_admin";

grant trigger on table "public"."user_roles" to "supabase_auth_admin";

grant truncate on table "public"."user_roles" to "supabase_auth_admin";

grant update on table "public"."user_roles" to "supabase_auth_admin";


  create policy "auth can read roles"
  on "public"."roles"
  as permissive
  for select
  to authenticated
using (true);



  create policy "supabase auth admin can read roles"
  on "public"."roles"
  as permissive
  for select
  to supabase_auth_admin
using (true);



  create policy "auth can delete user_roles if can_assign_role"
  on "public"."user_roles"
  as permissive
  for delete
  to public
using (private.can_assign_role(role_id));



  create policy "auth can insert user_roles if can_assign_role"
  on "public"."user_roles"
  as permissive
  for insert
  to authenticated
with check (private.can_assign_role(role_id));



  create policy "auth can read user_roles"
  on "public"."user_roles"
  as permissive
  for select
  to authenticated
using (true);



  create policy "supabase auth admin can read user_roles"
  on "public"."user_roles"
  as permissive
  for select
  to supabase_auth_admin
using (true);



