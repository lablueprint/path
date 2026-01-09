create schema if not exists "private";


  create table "public"."roles" (
    "role_id" integer not null,
    "name" text not null
      );


alter table "public"."roles" enable row level security;

CREATE UNIQUE INDEX roles_pkey ON public.roles USING btree (role_id);

alter table "public"."roles" add constraint "roles_pkey" PRIMARY KEY using index "roles_pkey";

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
  where id = new_role_id
  into new_role_name;
  
  -- Determine if the current user has the 'owner' role
  select exists (
    select 1
    from public.user_roles ur
    join public.roles r on ur.role_id = r.id
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
    join public.roles r on ur.role_id = r.id
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
    join public.roles r on ur.role_id = r.id
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
$function$
;

grant delete on table "public"."roles" to "anon";

grant insert on table "public"."roles" to "anon";

grant references on table "public"."roles" to "anon";

grant select on table "public"."roles" to "anon";

grant trigger on table "public"."roles" to "anon";

grant truncate on table "public"."roles" to "anon";

grant update on table "public"."roles" to "anon";

grant delete on table "public"."roles" to "authenticated";

grant insert on table "public"."roles" to "authenticated";

grant references on table "public"."roles" to "authenticated";

grant select on table "public"."roles" to "authenticated";

grant trigger on table "public"."roles" to "authenticated";

grant truncate on table "public"."roles" to "authenticated";

grant update on table "public"."roles" to "authenticated";

grant delete on table "public"."roles" to "service_role";

grant insert on table "public"."roles" to "service_role";

grant references on table "public"."roles" to "service_role";

grant select on table "public"."roles" to "service_role";

grant trigger on table "public"."roles" to "service_role";

grant truncate on table "public"."roles" to "service_role";

grant update on table "public"."roles" to "service_role";


  create policy "authenticated users can select entries"
  on "public"."roles"
  as permissive
  for select
  to authenticated
using (true);



  create policy "no user can delete entries"
  on "public"."roles"
  as permissive
  for delete
  to public
using (false);



  create policy "no users can insert entries"
  on "public"."roles"
  as permissive
  for insert
  to public
with check (false);



