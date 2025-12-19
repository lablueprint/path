create schema if not exists "private";


  create table "public"."roles" (
    "role_id" integer not null,
    "name" text not null
      );


alter table "public"."roles" enable row level security;


  create table "public"."user_roles" (
    "user_role_id" uuid not null default extensions.uuid_generate_v4(),
    "user_id" uuid not null,
    "role_id" integer not null
      );


alter table "public"."user_roles" enable row level security;

CREATE UNIQUE INDEX roles_pkey ON public.roles USING btree (role_id);

CREATE UNIQUE INDEX uq_user_id_role_id ON public.user_roles USING btree (user_id, role_id);

CREATE UNIQUE INDEX user_roles_pkey ON public.user_roles USING btree (user_role_id);

alter table "public"."roles" add constraint "roles_pkey" PRIMARY KEY using index "roles_pkey";

alter table "public"."user_roles" add constraint "user_roles_pkey" PRIMARY KEY using index "user_roles_pkey";

alter table "public"."user_roles" add constraint "fk_roles" FOREIGN KEY (role_id) REFERENCES public.roles(role_id) ON DELETE CASCADE not valid;

alter table "public"."user_roles" validate constraint "fk_roles";

alter table "public"."user_roles" add constraint "uq_user_id_role_id" UNIQUE using index "uq_user_id_role_id";

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

grant delete on table "public"."user_roles" to "anon";

grant insert on table "public"."user_roles" to "anon";

grant references on table "public"."user_roles" to "anon";

grant select on table "public"."user_roles" to "anon";

grant trigger on table "public"."user_roles" to "anon";

grant truncate on table "public"."user_roles" to "anon";

grant update on table "public"."user_roles" to "anon";

grant delete on table "public"."user_roles" to "authenticated";

grant insert on table "public"."user_roles" to "authenticated";

grant references on table "public"."user_roles" to "authenticated";

grant select on table "public"."user_roles" to "authenticated";

grant trigger on table "public"."user_roles" to "authenticated";

grant truncate on table "public"."user_roles" to "authenticated";

grant update on table "public"."user_roles" to "authenticated";

grant delete on table "public"."user_roles" to "service_role";

grant insert on table "public"."user_roles" to "service_role";

grant references on table "public"."user_roles" to "service_role";

grant select on table "public"."user_roles" to "service_role";

grant trigger on table "public"."user_roles" to "service_role";

grant truncate on table "public"."user_roles" to "service_role";

grant update on table "public"."user_roles" to "service_role";


  create policy "authenticated can read roles"
  on "public"."roles"
  as permissive
  for select
  to authenticated
using (true);



  create policy "no user can delete roles"
  on "public"."roles"
  as permissive
  for delete
  to public
using (false);



  create policy "no user can insert roles"
  on "public"."roles"
  as permissive
  for insert
  to public
with check (false);



  create policy "no user can update roles"
  on "public"."roles"
  as permissive
  for update
  to public
using (false)
with check (false);



  create policy "authenticated can delete user_roles if can_assign_role"
  on "public"."user_roles"
  as permissive
  for delete
  to public
using (private.can_assign_role(role_id));



  create policy "authenticated can insert user_roles if can_assign_role"
  on "public"."user_roles"
  as permissive
  for insert
  to authenticated
with check (private.can_assign_role(role_id));



  create policy "authenticated can read user_roles"
  on "public"."user_roles"
  as permissive
  for select
  to authenticated
using (true);



  create policy "no user can update user_roles"
  on "public"."user_roles"
  as permissive
  for update
  to public
using (false)
with check (false);



